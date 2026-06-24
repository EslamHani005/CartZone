using DomainLayer.Exceptions;
using Microsoft.AspNetCore.Http;
using Shared.ErrorModels;
using System.Text.Json;

namespace TalabatDemo.CustomMiddleWares
{
    public class CustomExceptionHandlerMiddleWare
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<CustomExceptionHandlerMiddleWare> _logger;

        public CustomExceptionHandlerMiddleWare( RequestDelegate Next  , ILogger<CustomExceptionHandlerMiddleWare> logger)
        {
            _next=Next;
            _logger=logger;
        }

        public async Task InvokeAsync(HttpContext httpContext)
        {
            try
            {
                await _next.Invoke(httpContext);
                await HandleNotFoundEndPointAsync(httpContext);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Somthing Went Wrong");
                await HandleExceptionAsync(httpContext, ex);
            }
        }

        private static async Task HandleExceptionAsync(HttpContext httpContext, Exception ex)
        {

            // Create Response Object
            var response = new ErrorToReturn()
            {
                ErrorMessage=ex.Message
            };

            //Set Status Code For Response
            httpContext.Response.StatusCode=ex switch
            {
                NotFoundException => StatusCodes.Status404NotFound,
                UnauthorizedException=>StatusCodes.Status401Unauthorized,
                BadRequestException badRequestEx=> GetBadRequestErrors(badRequestEx, response),
                _ => StatusCodes.Status500InternalServerError

            };
            response.StatusCode=httpContext.Response.StatusCode;

          
            //Return Object As Json
            await httpContext.Response.WriteAsJsonAsync(response);
        }
        private static int GetBadRequestErrors(BadRequestException badRequestException , ErrorToReturn response)
        {
            response.Errors=badRequestException.Errors;
            return StatusCodes.Status400BadRequest;
        }
        private static async Task HandleNotFoundEndPointAsync(HttpContext httpContext)
        {
            if (httpContext.Response.StatusCode == StatusCodes.Status404NotFound)
            {
                var response = new ErrorToReturn()
                {
                    StatusCode= StatusCodes.Status404NotFound,
                    ErrorMessage=$"End Point {httpContext.Request.Path} is Not Found"
                };

                await httpContext.Response.WriteAsJsonAsync(response);
            }
        }
    }
}
