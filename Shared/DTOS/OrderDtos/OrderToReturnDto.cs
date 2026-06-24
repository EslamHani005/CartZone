using Shared.DTOS.IdentityDtos;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Shared.DTOS.OrderDtos
{
    public class OrderToReturnDto
    {

        public string BuyerEmail { get; set; } = null!; //*
        public AddressDto ShipToAddress { get; set; } = null!;//*
        public string DeliveryMethod { get; set; } = null!; 
        public ICollection<OrderItemDto> Items { get; set; } = [];

        public string Status { get; set; } = null!;//*

        public Guid Id { get; set; }
        public DateTimeOffset OrderDate { get; set; }
        public decimal SubTotal { get; set; }
        public decimal Total { get; set; }


    }
}
