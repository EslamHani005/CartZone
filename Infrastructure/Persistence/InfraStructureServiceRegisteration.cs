using DomainLayer.Contracts;
using DomainLayer.Models.IdentityModels;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Persistence.Identity;
using Persistence.Repositories;
using PersistenceLayer;
using PersistenceLayer.Data;
using StackExchange.Redis;


namespace Persistence
{
    public static class InfraStructureServiceRegisteration
    {

        public static IServiceCollection AddInfraStructureService(this IServiceCollection Services , IConfiguration _configuration) 
        {

            #region Db Connections
            Services.AddDbContext<StoreDbContext>(options =>
            {
                options.UseSqlServer(_configuration.GetConnectionString("DefaultConnection"));
            });
            Services.AddSingleton<IConnectionMultiplexer>((_) =>
            {
                return ConnectionMultiplexer.Connect(_configuration.GetConnectionString("ReddisConnectionString"));
            });

            Services.AddDbContext<StoreIdentityDbContext>(options =>
            {
                options.UseSqlServer(_configuration.GetConnectionString("IdentityConnection"));
            });



            Services.AddIdentityCore<ApplicationUser>().AddRoles<IdentityRole>()
              .AddEntityFrameworkStores<StoreIdentityDbContext>();

            #endregion

            Services.AddScoped<IDataSeeding, DataSeeding>();
            Services.AddScoped<IUnitOfWork, UnitOfWork>();
            Services.AddScoped<IBasketRepository, BasketRepository>();
            Services.AddScoped<ICacheRepository, CacheRepository>();

     
            return Services;
        }
    }
}
