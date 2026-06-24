using AutoMapper;
using DomainLayer.Models.ProductModels;
using Shared.DTOS.ProductDtos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ServiceLayer.MappingProfiles
{
    public class ProductProfile :Profile
    {

        public ProductProfile()
        {
            CreateMap<Product, ProductDto>()
                .ForMember(dest => dest.ProductBrand, options => options.MapFrom(src => src.ProductBrand.Name))
                .ForMember(dest => dest.ProductType, options => options.MapFrom(src => src.ProductType.Name))
                .ForMember(dest => dest.PictureUrl, options => options.MapFrom<PictureUrlResolver>());


            CreateMap<ProductType, TypeDto>();
            CreateMap<ProductBrand, BrandDto>();
        
        }
    }
}
