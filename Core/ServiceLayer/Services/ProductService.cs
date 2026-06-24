using AutoMapper;
using DomainLayer.Contracts;
using DomainLayer.Exceptions;
using DomainLayer.Models.ProductModels;
using ServiceAbstractionlayer;
using ServiceLayer.Specifications;
using ServiceLayer.Specifications.ProductModuleSpecidfication;
using Shared;
using Shared.DTOS.ProductDtos;


namespace ServiceLayer.Services
{
    public class ProductService (IUnitOfWork _unitOfWork , IMapper _mapper): IProductService
    {
        #region Types And Brands
        public async Task<IEnumerable<BrandDto>> GetAllBrandsAsync()
        {
            var repo = _unitOfWork.GetRepository<ProductBrand, int>();
            var brands = await repo.GetAllAsync();

            var brandsDtos = _mapper.Map<IEnumerable<BrandDto>>(brands);
            return brandsDtos;

        }
        public async Task<IEnumerable<TypeDto>> GetAllTypesAsync()
        {
            var types = await _unitOfWork.GetRepository<ProductType, int>().GetAllAsync();
            return _mapper.Map<IEnumerable<TypeDto>>(types);
        } 
        #endregion


        public async Task<PaginatedResult<ProductDto>> GetAllProductsAsync(ProductQueryParams queryParams)
        {
            var repo = _unitOfWork.GetRepository<Product, int>();
            //Create Object From Specification 

            var specs = new ProductWithBrandAndTypeSpecifications(queryParams);//.Include(p=>p.ProductType).Include(p=>p.ProductBrand)
            var products =await repo.GetAllAsync(specs);
            var mappedProducts= _mapper.Map<IEnumerable<ProductDto>>(products);


            var countSpecs= new ProductCountSpecfictations(queryParams);
            var totalCount=await repo.CountAsync(countSpecs);

            return new PaginatedResult<ProductDto>(queryParams.PageIndex, queryParams.PageSize , totalCount, mappedProducts );

        }


        public async Task<ProductDto> GetProductByIdAsync(int id)
        {

            var specs = new ProductWithBrandAndTypeSpecifications(id);

            var product = await _unitOfWork.GetRepository<Product, int>().GetByIdAsync(specs);
            if (product is null) throw new ProductNotFoundException(id);
            return _mapper.Map<ProductDto>(product);
        }
    }
}
