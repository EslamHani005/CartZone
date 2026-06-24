using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ServiceAbstractionlayer;
using Shared.DTOS.BasketDtos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace Peresentation.Controllers
{
    public class PaymentsController(IServiceManager _serviceManager) :ApiBaseController
    {
        [Authorize]
        [HttpPost("{basketId}")]
        public async Task<ActionResult<BasketDto>> CreateOrUpdatePaymentIntent(string basketId)
        {
            var basket =await _serviceManager.PaymentService.CreateOrUpdatePaymentIntent(basketId);
            return Ok(basket);
        }



        #region Copied
        //stripe listen --forward-to http://localhost:7040/api/Payments/webhook

        [HttpPost("webhook")]
        public async Task<IActionResult> Index()
        {
            var json = await new StreamReader(HttpContext.Request.Body).ReadToEndAsync();

            //Logic
            await _serviceManager.PaymentService.UpdatePaymentStatus(json,
                Request.Headers["Stripe-Signature"]);

            return new EmptyResult();


        }

        #endregion

    }
}
