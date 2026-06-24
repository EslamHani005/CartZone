using DomainLayer.Models.ProductModels;
using Shared;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ServiceLayer.Specifications.ProductModuleSpecidfication
{
    internal class ProductWithBrandAndTypeSpecifications : BaseSpecifications<Product,int>
    {

        //Get All Products With Types And Brands
        public ProductWithBrandAndTypeSpecifications(ProductQueryParams queryParams) 
            :base(p=> (!queryParams.BrandId.HasValue || p.BrandId==queryParams.BrandId)
                   && (!queryParams.TypeId.HasValue || p.TypeId==queryParams.TypeId)
            &&(string.IsNullOrWhiteSpace(queryParams.Search) ||p.Name.ToLower().Contains(queryParams.Search.ToLower())))
        {//Where(p=> p.BrandId==brandId && TypeID == TypeId && p.Name.Contains("chicken"))
            AddInclude(p=>p.ProductType);
            AddInclude(p=>p.ProductBrand);


            switch (queryParams.Sort)
            {
                case ProductSortingOptions.NameAsc:
                    AddOrderBy(p => p.Name);
                    break;

                case ProductSortingOptions.NameDesc:
                    AddOrderByDescending(p => p.Name);
                    break;
                case ProductSortingOptions.PriceAsc:
                    AddOrderBy(p => p.Price);
                    break;

                case ProductSortingOptions.PriceDesc:
                    AddOrderByDescending(p => p.Price);
                    break;

                default:
                    break;
            }


            ApplyPagination(queryParams.PageSize, queryParams.PageIndex);
        }


        //Get  Product By Id With Type And Brand
        public ProductWithBrandAndTypeSpecifications(int id) : base(p=>p.Id== id)
        {
            AddInclude(p => p.ProductType);
            AddInclude(p => p.ProductBrand);
        }
    }
}
