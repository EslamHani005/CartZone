using Microsoft.AspNetCore.DataProtection.KeyManagement;
using Microsoft.AspNetCore.Mvc;
using ServiceAbstractionlayer;
using Shared.DTOS.BasketDtos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Peresentation.Controllers
{
    [ApiController]
    [Route("api/[Controller]")]
    public class BasketController(IServiceManager _serviceManager) : ControllerBase
    {

        [HttpGet]
        public async Task<ActionResult<BasketDto>> GetBasket(string key) { 
        
           var basket= await _serviceManager.BasketService.GetBasketAsync(key);
            return Ok(basket);
        }

        [HttpPost]
        public async Task<ActionResult<BasketDto>> CreateOrUpdateBasket(BasketDto basket)
        {

            var result = await _serviceManager.BasketService.CreateOrUpdateBasketAsync(basket);
            return Ok(result);

        }

        [HttpDelete]
        public async Task<ActionResult<bool>> DeleteBasket(string key)
        {
            var res= await _serviceManager.BasketService.DeleteBasketAsync(key);
            return Ok(res); 
        }



    }
}
