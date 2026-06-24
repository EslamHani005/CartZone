using DomainLayer.Models.ProductModels;
using Shared;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ServiceLayer.Specifications.ProductModuleSpecidfication
{
    public class ProductCountSpecfictations:BaseSpecifications<Product, int>
    {
        //Get All Products With Types And Brands
        public ProductCountSpecfictations(ProductQueryParams queryParams)
            : base(p => (!queryParams.BrandId.HasValue || p.BrandId==queryParams.BrandId)
                   && (!queryParams.TypeId.HasValue || p.TypeId==queryParams.TypeId)
            &&(string.IsNullOrWhiteSpace(queryParams.Search) ||p.Name.ToLower().Contains(queryParams.Search.ToLower())))
        {
        }
    }
}
