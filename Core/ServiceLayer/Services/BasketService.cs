using AutoMapper;
using DomainLayer.Contracts;
using ServiceAbstractionlayer;
using Shared.DTOS.BasketDtos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using DomainLayer.Exceptions;
using DomainLayer.Models.BasketModels;

namespace ServiceLayer.Services
{
    public class BasketService (IBasketRepository _basketRepository , IMapper _mapper): IBasketService
    {
        public async Task<BasketDto> CreateOrUpdateBasketAsync(BasketDto basket)
        {
            var customerBasket = _mapper.Map<CustomerBasket>(basket);
            var createdOrUpdatedBasket =await _basketRepository.CreateOrUpdateBasketAsync(customerBasket);

            if (createdOrUpdatedBasket is not null) return await GetBasketAsync(basket.Id);
            else throw new Exception("Can not Update Or Create Basket , Try Again Later");

        }

        public async Task<bool> DeleteBasketAsync(string key)
       => await _basketRepository.DeleteBasketAsync(key);

        public async Task<BasketDto> GetBasketAsync(string key)
        {
            var basket = await _basketRepository.GetBasketAsync(key);
            if (basket is not null) return _mapper.Map<BasketDto>(basket);
            else throw new BasketNotFoundException(key);
        }
    }
}
