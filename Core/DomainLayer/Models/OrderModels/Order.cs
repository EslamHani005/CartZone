using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DomainLayer.Models.OrderModels
{
    public class Order:BaseEntity<Guid>
    {
        public Order()
        {
            
        }
        public Order(string userEmail, OrderAddress address, DeliveryMethod deliveryMethod, ICollection<OrderItem> items, decimal subTotal, string paymentIntentId)
        {
            UserEmail=userEmail;
            Address=address;
            DeliveryMethod=deliveryMethod;
            Items=items;
            SubTotal=subTotal;
            PaymentIntentId=paymentIntentId;
        }

        public string UserEmail { get; set; } = null!;
        public OrderAddress Address { get; set; } = null!;
        public DeliveryMethod DeliveryMethod { get; set; } = null!;
        public ICollection<OrderItem> Items { get; set; } = [];
        public decimal SubTotal { get; set; }

        public OrderStatus OrderStatus { get; set; }

        public DateTimeOffset OrderDate { get; set; } = DateTimeOffset.Now;



        [NotMapped]
        public decimal Total { get => SubTotal+DeliveryMethod?.Price??0; }
        //public decimal GetTotal() => SubTotal+DeliveryMethod.Price;
        public int DeliveryMethodId { get; set; }
        public string PaymentIntentId { get; set; }

    }
}
