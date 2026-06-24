using DomainLayer.Contracts;
using DomainLayer.Models.IdentityModels;
using DomainLayer.Models.OrderModels;
using DomainLayer.Models.ProductModels;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using PersistenceLayer.Data;
using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.Linq;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace PersistenceLayer
{
    public class DataSeeding(StoreDbContext _storeDbContext, 
                             UserManager<ApplicationUser> _userManager,
                             RoleManager<IdentityRole> _roleManager) 
        : IDataSeeding
    {

      
        public async Task DataSeedAsync()
        {
            //Production
            if ((await _storeDbContext.Database.GetPendingMigrationsAsync()).Any())
            {
                await _storeDbContext.Database.MigrateAsync();
            }

            if (!_storeDbContext.ProductBrands.Any()) {

                //var productBrands = await File.ReadAllTextAsync("../Infrastructure/Persistence/Data/DataSeeding/brands.json");
                var productBrands =  File.OpenRead("../CartZone.Api/wwwroot/DataSeeding/brands.json");
                var brands =await JsonSerializer.DeserializeAsync<List<ProductBrand>>(productBrands);

                if (  brands is not null && brands.Any()) { 
                    await _storeDbContext.AddRangeAsync(brands);     
                }       
            }

            if (!_storeDbContext.ProductTypes.Any())
            {

                var productTypes = File.OpenRead("../CartZone.Api/wwwroot/DataSeeding/types.json");
                var types =await  JsonSerializer.DeserializeAsync<List<ProductType>>(productTypes);

                if (types is not null && types.Any())
                {
                   await _storeDbContext.AddRangeAsync(types);

                }
            }


            if (!_storeDbContext.Products.Any())
            {

                var products = File.OpenRead("../CartZone.Api/wwwroot/DataSeeding/products.json");
                var prods =await JsonSerializer.DeserializeAsync<List<Product>>(products);

                if (prods is not null && prods.Any())
                {
                    await _storeDbContext.AddRangeAsync(prods);

                }
            }


            if (!_storeDbContext.Set<DeliveryMethod>().Any())
            {

                var deliveryMethods = File.OpenRead("../CartZone.Api/wwwroot/DataSeeding/delivery.json");
                var deliveryMethodsObjs = await JsonSerializer.DeserializeAsync<List<DeliveryMethod>>(deliveryMethods);

                if (deliveryMethodsObjs is not null && deliveryMethodsObjs.Any())
                {
                    await _storeDbContext.AddRangeAsync(deliveryMethodsObjs);

                }
            }


            await _storeDbContext.SaveChangesAsync();
        }

        public async Task IdentityDataSeedAsync()
        {
            try
            {
                if (!_roleManager.Roles.Any())
                {
                    await _roleManager.CreateAsync(new IdentityRole("Admin"));
                    await _roleManager.CreateAsync(new IdentityRole("SuperAdmin"));
                }

                if (!_userManager.Users.Any())
                {
                    var user01 = new ApplicationUser()
                    {
                        Email="omarsoliman@gmail.com",
                        DisplayName="omar soliman",
                        PhoneNumber="01027712191",
                        UserName="omarsoliman"

                    };
                    var user02 = new ApplicationUser()
                    {
                        Email="salmamohammed@gmail.com",
                        DisplayName="salma mohammed",
                        PhoneNumber="01029912191",
                        UserName="salmamohammed"

                    };

                    await _userManager.CreateAsync(user01, "P@ssw0rd");
                    await _userManager.CreateAsync(user02, "P@ssw0rd");

                    await _userManager.AddToRoleAsync(user01, "Admin");
                    await _userManager.AddToRoleAsync(user02, "SuperAdmin");
                }
            }
            catch (Exception)
            {

                throw;
            }
        }
    }
}
