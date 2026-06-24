using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.Extensions.DependencyInjection;
using ServiceAbstractionlayer;
using System;
using System.Buffers;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Peresentation.Attributes
{
    public class CacheAttribute(int durationInSec= 100) :ActionFilterAttribute
    {
        public override async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
        {
            //Create Cache Key

            var cacheKey = CreateCacheKey(context.HttpContext.Request);
            //Search For Value In (Redis) With Key
            var _cacheService = context.HttpContext.RequestServices
                                        .GetRequiredService<ICacheService>();

            var cacheValue = await _cacheService.GetAsync(cacheKey);
            //Return Value If Found ( No End Point Processing )
            if(cacheValue is not null)
            {
                context.Result = new ContentResult()
                {
                    Content = cacheValue,
                    ContentType="application/json",
                    StatusCode = StatusCodes.Status200OK
                };
                return;
            }
            //If Value Is Null
            // (Process Request In End Point ) next.Invoke()
            var executedContext = await next.Invoke();

            //Set Value With  Cache Key


            if(executedContext.Result is OkObjectResult result)
            {
               await _cacheService.SetAsync(cacheKey, result.Value, TimeSpan.FromSeconds(durationInSec));

            }
        }
        private string CreateCacheKey(HttpRequest request)
        {
            StringBuilder key = new StringBuilder();
            key.Append(request.Path+"?");
            foreach (var item in request.Query.OrderBy(q=>q.Key))
            {
                key.Append($"{item.Key}={item.Value}&");
            }
            return key.ToString();

        }


    }
}
