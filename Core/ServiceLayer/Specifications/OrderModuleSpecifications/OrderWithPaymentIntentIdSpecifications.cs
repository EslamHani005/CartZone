using DomainLayer.Models.OrderModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ServiceLayer.Specifications.OrderModuleSpecifications
{
    public class OrderWithPaymentIntentIdSpecifications:BaseSpecifications<Order,Guid>
    {
        public OrderWithPaymentIntentIdSpecifications(string paymentIntentId)
            :base (O=>O.PaymentIntentId== paymentIntentId)
        {
            
        }
    }
}
