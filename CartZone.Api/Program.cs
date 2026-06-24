
using Microsoft.AspNetCore.Mvc;
using ServiceLayer;
using CartZone.Factories;
using Persistence;
using CartZone.Extentions;
using Swashbuckle.AspNetCore.SwaggerUI;

namespace CartZone
{
    public class Program
    {
        public static async Task Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            #region Add services to the DI container
            builder.Services.AddControllers();
            builder.Services.AddSwaggerService();
            builder.Services.AddCors(options =>
            {
                options.AddPolicy("AllowAll", builder =>
                {
                    builder.AllowAnyHeader();
                    builder.AllowAnyMethod();
                    builder.AllowAnyOrigin();
                });
            });

            #region Register User-Defined Services 

            builder.Services.AddApplicationServices();
            builder.Services.AddInfraStructureService(builder.Configuration);
            builder.Services.AddWebApplicationServices();
            builder.Services.AddJwtService(builder.Configuration);

     
            #endregion

            builder.Services.Configure<ApiBehaviorOptions>((options) =>
            {
                options.InvalidModelStateResponseFactory= ApiResponseFactory.GenerateApiValidationErrorResponse;

            });



            #endregion

            var app = builder.Build();
            await app.SeedDatabaseAsync();


            #region Configure the HTTP request pipeline


            app.UseCustomExceptionMiddleware();

            //if (app.Environment.IsDevelopment())
            //{
                app.UseSwagger();
                app.UseSwaggerUI(options =>
                {
                    options.ConfigObject=new ConfigObject()
                    {
                        DisplayRequestDuration=true
                    };
                    options.DocumentTitle="CartZone Ecommerce App";
                    options.DocExpansion(DocExpansion.None);
                    options.EnableFilter();
                    options.EnablePersistAuthorization();
                });
            //}
            app.UseHttpsRedirection();

            app.UseAuthentication();
            app.UseAuthorization();
            

            app.UseStaticFiles();
            app.UseCors("AllowAll");
            app.MapControllers();

            app.Run(); 
            #endregion
        }
    }
}
