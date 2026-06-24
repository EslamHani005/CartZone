using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Peresentation.Attributes;
using ServiceAbstractionlayer;
using Shared;
using Shared.DTOS.ProductDtos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Peresentation.Controllers
{
    [ApiController]
    [Route("api/[Controller]")]
    public class ProductsController (IServiceManager _serviceManager): ControllerBase
    {

        //Get All Products
        [HttpGet]  //Get :: BaseUrl/api/Products
        //[Authorize(Roles ="Admin")]
        [CacheAttribute]
        public async Task<ActionResult<PaginatedResult<ProductDto>>> GetAllProducts([FromQuery]ProductQueryParams queryParams)
        {
            var products =await _serviceManager.ProductService.GetAllProductsAsync(queryParams)  ;
            return Ok(products);

        }
        //Get Product By Id
        [HttpGet("{id}")]//Get :: BaseUrl/api/Products/4
        public async Task<ActionResult<ProductDto>> GetProductById(int id)
        {
            var product = await _serviceManager.ProductService.GetProductByIdAsync(id);
            return Ok(product);
        }

        //Get All Brands
        [HttpGet("brands")] //Get :: BaseUrl/api/Products/brands
        public async Task<ActionResult<BrandDto>> GetAllBrands()
        {
            var brands =await _serviceManager.ProductService.GetAllBrandsAsync();
            return Ok(brands);
        }
        //Get All Types
        [HttpGet("types")] //Get :: BaseUrl/api/Products/types
        public async Task<ActionResult<TypeDto>> GetAllTypesAsync()
        {
            var types = await _serviceManager.ProductService.GetAllTypesAsync();
            return Ok(types);

        }

    }
}
