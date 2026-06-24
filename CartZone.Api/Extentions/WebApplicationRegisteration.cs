using DomainLayer.Contracts;
using CartZone.CustomMiddleWares;

namespace CartZone.Extentions
{
    public static class WebApplicationRegisteration
    {
        public async static Task SeedDatabaseAsync(this WebApplication app) {

            using var scope = app.Services.CreateScope();
            var seedObj = scope.ServiceProvider.GetRequiredService<IDataSeeding>();
            await seedObj.DataSeedAsync();
            await seedObj.IdentityDataSeedAsync();

        }
        public  static IApplicationBuilder UseCustomExceptionMiddleware(this IApplicationBuilder app) {

            app.UseMiddleware<CustomExceptionHandlerMiddleWare>();
            return app;

        }

    }
}
