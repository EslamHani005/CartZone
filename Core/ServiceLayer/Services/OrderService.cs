using AutoMapper;
using DomainLayer.Contracts;
using DomainLayer.Exceptions;
using DomainLayer.Models.OrderModels;
using DomainLayer.Models.ProductModels;
using ServiceAbstractionlayer;
using ServiceLayer.Specifications.OrderModuleSpecifications;
using Shared.DTOS.OrderDtos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ServiceLayer.Services
{
    public class OrderService(IMapper _mapper , 
                              IBasketRepository _basketRepository,
                              IUnitOfWork _unitOfWork) : IOrderService
    {
        //public async Task<OrderToReturnDto> CreateOrderAsync(OrderDto orderDto, string email)
        //{
        //    //Map Address
        //    var orderAddress = _mapper.Map<OrderAddress>(orderDto.ShipToAddress);
        //    //Get Basket
        //    var basket =await _basketRepository.GetBasketAsync(orderDto.BasketId)
        //               ??throw new BasketNotFoundException(orderDto.BasketId);

        //    ArgumentNullException.ThrowIfNull(basket.PaymentIntentId);

        //    var OrderRepo = _unitOfWork.GetRepository<Order, Guid>();
        //    var orderSpecs = new OrderWithPaymentIntentIdSpecifications(basket.PaymentIntentId);
        //    var existingOrder =await OrderRepo.GetByIdAsync(orderSpecs);

        //    if (existingOrder is not null)
        //    {
        //        OrderRepo.Remove(existingOrder);
        //        await _unitOfWork.SaveChangesAsync();
        //    }
        //    //Create Order Items
        //    List<OrderItem> OrderItems = [];
        //    var productRepo = _unitOfWork.GetRepository<Product, int>();
        //    foreach (var basketItem in basket.Items)
        //    {
        //        var originalProduct =await productRepo.GetByIdAsync(basketItem.Id)
        //                            ?? throw new ProductNotFoundException(basketItem.Id);


        //        var orderItem = new OrderItem()
        //        {
        //            Product=new ProductItemOrdered()
        //            {
        //                ProductId=originalProduct.Id,
        //                PictureUrl=originalProduct.PictureUrl,
        //                ProductName=originalProduct.Name,
        //            },
        //            Price=originalProduct.Price,
        //            Quantity=basketItem.Quantity
        //        };

        //        OrderItems.Add(orderItem);

        //    }

        //    //Get Delivery Method
        //    var deliveryMethod=await _unitOfWork
        //                       .GetRepository<DeliveryMethod, int>()
        //                       .GetByIdAsync(orderDto.DeliveryMethodId)
        //     ?? throw new DeliveryMethodNotFoundException(orderDto.DeliveryMethodId);

        //    //Sub Total
        //    var subTotal = OrderItems.Sum(i => i.Quantity*i.Price);

        //    //Create Order Object
        //    var order = new Order(email, orderAddress, deliveryMethod,OrderItems,subTotal ,basket.PaymentIntentId);

        //    await OrderRepo.AddAsync(order);
        //    await _unitOfWork.SaveChangesAsync();

        //    return _mapper.Map<OrderToReturnDto>(order);
        //}


        public async Task<OrderToReturnDto> CreateOrderAsync(OrderDto orderDto, string email)
        {
            //Map Address
            var orderAddress = _mapper.Map<OrderAddress>(orderDto.ShipToAddress);
            //Get Basket
            var basket = await _basketRepository.GetBasketAsync(orderDto.BasketId)
                       ??throw new BasketNotFoundException(orderDto.BasketId);

            ArgumentNullException.ThrowIfNull(basket.PaymentIntentId);

            var OrderRepo = _unitOfWork.GetRepository<Order, Guid>();
            var existingOrderSpecs = new OrderWithPaymentIntentIdSpecifications(basket.PaymentIntentId);
            var existingOrder = await OrderRepo.GetByIdAsync(existingOrderSpecs);
            if (existingOrder is not null) OrderRepo.Remove(existingOrder);

            //Create Order Items
            List<OrderItem> OrderItems = [];
            var productRepo = _unitOfWork.GetRepository<Product, int>();
            foreach (var basketItem in basket.Items)
            {
                var originalProduct = await productRepo.GetByIdAsync(basketItem.Id)
                                    ?? throw new ProductNotFoundException(basketItem.Id);


                var orderItem = new OrderItem()
                {
                    Product=new ProductItemOrdered()
                    {
                        ProductId=originalProduct.Id,
                        PictureUrl=originalProduct.PictureUrl,
                        ProductName=originalProduct.Name,
                    },
                    Price=originalProduct.Price,
                    Quantity=basketItem.Quantity
                };

                OrderItems.Add(orderItem);

            }

            //Get Delivery Method
            var deliveryMethod = await _unitOfWork
                               .GetRepository<DeliveryMethod, int>()
                               .GetByIdAsync(orderDto.DeliveryMethodId)
             ?? throw new DeliveryMethodNotFoundException(orderDto.DeliveryMethodId);

            //Sub Total
            var subTotal = OrderItems.Sum(i => i.Quantity*i.Price);

            //Create Order Object
            var order = new Order(email, orderAddress, deliveryMethod, OrderItems, subTotal, basket.PaymentIntentId);

            await OrderRepo.AddAsync(order);
            try
            {
                await _unitOfWork.SaveChangesAsync();

            }
            catch (Exception)
            {

            }

            return _mapper.Map<OrderToReturnDto>(order);
        }



        public async Task<IEnumerable<OrderToReturnDto>> GetAllOrdersAsync(string email)
        {
            var specs = new OrderSpecifications(email);
            var orders =await _unitOfWork.GetRepository<Order, Guid>().GetAllAsync(specs);
            return _mapper.Map<IEnumerable<OrderToReturnDto>>(orders);
        }

    
        public  async Task<OrderToReturnDto> GetOrderByIdAsync(Guid id)
        {
            var specs = new OrderSpecifications(id);
            var order = await _unitOfWork.GetRepository<Order, Guid>().GetByIdAsync(specs);
            return _mapper.Map<OrderToReturnDto>(order);
        }


        public async Task<IEnumerable<DeliveryMethodDto>> GetDeliveryMethodsAsync()
        {
            var deliveryMethods =await _unitOfWork.GetRepository<DeliveryMethod, int>().GetAllAsync();
            return _mapper.Map<IEnumerable<DeliveryMethodDto>>(deliveryMethods);
        }

    }
}
