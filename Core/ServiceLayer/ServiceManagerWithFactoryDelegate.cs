using ServiceAbstractionlayer;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ServiceLayer
{
    internal class ServiceManagerWithFactoryDelegate(Func<IProductService> productServiceFactory, 
                                                     Func<IBasketService> basketServiceFactory, 
                                                     Func<IAuthenticationService> authenticationServiceFactory, 
                                                     Func<IOrderService> orderServiceFactory,
                                                     Func<IPaymentService> paymentServiceFactory) : IServiceManager
    {
        public IProductService ProductService => productServiceFactory.Invoke();

        public IBasketService BasketService => basketServiceFactory.Invoke();

        public IAuthenticationService AuthenticationService => authenticationServiceFactory.Invoke();

        public IOrderService OrderService => orderServiceFactory.Invoke();
        public IPaymentService PaymentService => paymentServiceFactory.Invoke();
    }
}
