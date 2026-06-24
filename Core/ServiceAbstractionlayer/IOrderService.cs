using Shared.DTOS.OrderDtos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ServiceAbstractionlayer
{
    public interface IOrderService
    {

        //Create Order
        Task<OrderToReturnDto> CreateOrderAsync(OrderDto orderDto, string email);

        //Get Delivery Methods
        Task<IEnumerable<DeliveryMethodDto>> GetDeliveryMethodsAsync();
        
        //Get All Orders Of Specific Customer
        Task<IEnumerable<OrderToReturnDto>> GetAllOrdersAsync(string email);

        Task<OrderToReturnDto> GetOrderByIdAsync(Guid id);

    }
}
