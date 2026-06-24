using DomainLayer.Models.OrderModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ServiceLayer.Specifications.OrderModuleSpecifications
{
    public class OrderSpecifications : BaseSpecifications<Order,Guid>
    {
        //Get All By Email : o=>o.Email == claimsEmail
        public OrderSpecifications(string email): base(O=>O.UserEmail == email)
        {
            AddInclude(O => O.DeliveryMethod);
            AddInclude(O => O.Items);
            AddOrderByDescending(O=>O.OrderDate);
        }

        //Get By ID
        public OrderSpecifications(Guid id):base(O=>O.Id==id)
        {
            AddInclude(O => O.DeliveryMethod);
            AddInclude(O => O.Items);

        }
    }
}
