using AutoMapper;
using DomainLayer.Contracts;
using DomainLayer.Exceptions;
using DomainLayer.Models.BasketModels;
using DomainLayer.Models.OrderModels;
using DomainLayer.Models.ProductModels;
using Microsoft.Extensions.Configuration;
using ServiceAbstractionlayer;
using ServiceLayer.Specifications.OrderModuleSpecifications;
using Shared.DTOS.BasketDtos;
using Shared.DTOS.OrderDtos;
using Stripe;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Product = DomainLayer.Models.ProductModels.Product;

namespace ServiceLayer.Services
{
    public class PaymentService(IConfiguration _configuration, 
                                IBasketRepository _basketRepository,
                                IUnitOfWork _unitOfWork,
                                IMapper _mapper) : IPaymentService
    {
        public async Task<BasketDto> CreateOrUpdatePaymentIntent(string basketId)
        {
            //Configure Stripe : Install Package Stripe.Net

            StripeConfiguration.ApiKey=_configuration["StripeSettings:SecretKey"];

            //Get Basket By Id
            var basket = await _basketRepository.GetBasketAsync(basketId)               
            ??throw new BasketNotFoundException(basketId);


            //Get Ammount (products Qty * price)+Delivery Method Cost

            var productRepo = _unitOfWork.GetRepository<Product, int>();
            foreach (var item in basket.Items)
            {
                var originalProduct = await productRepo.GetByIdAsync(item.Id)
                    ?? throw new ProductNotFoundException(item.Id);
                item.Price=originalProduct.Price;
            }
            ArgumentNullException.ThrowIfNull(basket.DeliveryMethodId);
            var deliveryMehtod = await _unitOfWork.GetRepository<DeliveryMethod, int>()
                                .GetByIdAsync(basket.DeliveryMethodId!.Value) ??
               throw new DeliveryMethodNotFoundException(basket.DeliveryMethodId!.Value);

            basket.ShippingPrice=deliveryMehtod.Price;
            var basketAmount = (long)(basket.Items.Sum(item => item.Quantity * item.Price)+deliveryMehtod.Price)*100;
            //Create Payment Intent Id
            var paymentServie = new PaymentIntentService();
            if(basket.PaymentIntentId is null)//Create
            {
                var options = new PaymentIntentCreateOptions()
                {
                    Amount=basketAmount,
                    Currency="USD",
                    PaymentMethodTypes= ["card"]
                };
                var paymentIntent = await paymentServie.CreateAsync(options);
                basket.PaymentIntentId=paymentIntent.Id;
                basket.ClientSecret=paymentIntent.ClientSecret;//////****ERROR*****

            }
            else //Update
            {
                var options = new PaymentIntentUpdateOptions()
                {
                    Amount=basketAmount,
                };
                await paymentServie.UpdateAsync(basket.PaymentIntentId, options);
                
            }
            await _basketRepository.CreateOrUpdateBasketAsync(basket);
            return _mapper.Map<BasketDto>(basket);
        }



        public async Task UpdatePaymentStatus(string jsonRequest, string stripeHeader)
        {
            var stripeEvent = EventUtility.ConstructEvent(jsonRequest,
                      stripeHeader, _configuration["StripeSettings:EndPointSecret"]);


            var paymentIntent = stripeEvent.Data.Object as PaymentIntent;
            if (stripeEvent.Type == EventTypes.PaymentIntentPaymentFailed)
            {
                await UpdatePaymentFailedAsync(paymentIntent.Id);
            }
            else if (stripeEvent.Type == EventTypes.PaymentIntentSucceeded)
            {
                await UpdatePaymentReceivedAsync(paymentIntent.Id);

            }
            // ... handle other event types
            else
            {
                Console.WriteLine("Unhandled event type: {0}", stripeEvent.Type);
            }
        }

        private async Task UpdatePaymentReceivedAsync(string paymentIntentId)
        {
            var order = await _unitOfWork.GetRepository<Order, Guid>()
                .GetByIdAsync(new OrderWithPaymentIntentIdSpecifications(paymentIntentId));

            order.OrderStatus = OrderStatus.PaymentReceived;

            _unitOfWork.GetRepository<Order, Guid>().Update(order);
            await _unitOfWork.SaveChangesAsync();
        }

        private async Task UpdatePaymentFailedAsync(string paymentIntentId)
        {
            var order = await _unitOfWork.GetRepository<Order, Guid>()
                .GetByIdAsync(new OrderWithPaymentIntentIdSpecifications(paymentIntentId));

            order.OrderStatus = OrderStatus.PaymentFailed;

            _unitOfWork.GetRepository<Order, Guid>().Update(order);
            await _unitOfWork.SaveChangesAsync();
        }
    }
}
