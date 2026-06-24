using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ServiceAbstractionlayer;
using Shared.DTOS.OrderDtos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Peresentation.Controllers
{
    [Authorize]
    public class OrderController(IServiceManager _serviceManager)  : ApiBaseController
    {

        [HttpPost]//Post BaseUrl/api/Order
        public async Task<ActionResult<OrderToReturnDto>> CreateOrder(OrderDto orderDto)
        {
           var orderToReturn =await _serviceManager.OrderService.CreateOrderAsync(orderDto,GetEmailFromToken());
            return Ok(orderToReturn);
        }

  
        [HttpGet]
        public async Task<ActionResult<IEnumerable<OrderToReturnDto>>> GetAllOrders()
        {
            var orders = await _serviceManager.OrderService.GetAllOrdersAsync(GetEmailFromToken());
            return Ok(orders);
        }

        [HttpGet("{id:guid}")]
        public async Task<ActionResult<IEnumerable<OrderToReturnDto>>> GetOrderById(Guid id)
        {
            var order =await _serviceManager.OrderService.GetOrderByIdAsync(id);
            return Ok(order);
        }



        //Get All Delivery Methods
        [HttpGet("DeliveryMethods")]
        [AllowAnonymous]
        public async Task<ActionResult<IEnumerable<DeliveryMethodDto>>> GetDeliveryMethods()
        {
            var deliveryMethods = await _serviceManager.OrderService.GetDeliveryMethodsAsync();
            return Ok(deliveryMethods);
        }

    }
}
