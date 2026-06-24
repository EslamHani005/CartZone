using Shared;
using Shared.DTOS.ProductDtos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ServiceAbstractionlayer
{
    public interface IProductService
    {
        //GetAllProducts

        Task<PaginatedResult<ProductDto>> GetAllProductsAsync(ProductQueryParams queryParams);

        //Get Product By Id
        Task<ProductDto> GetProductByIdAsync(int id);

        //Get All Types

        Task<IEnumerable<TypeDto>> GetAllTypesAsync();
        //Get All Brands
        Task<IEnumerable<BrandDto>> GetAllBrandsAsync();

    }
}
