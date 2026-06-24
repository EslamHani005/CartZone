using Shared.DTOS.IdentityDtos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ServiceAbstractionlayer
{
    public interface IAuthenticationService
    {
        //Login (Email , Password)  -> Token , Email , Display Name
        Task<UserDto> LoginAsync(LoginDto loginDto);

        //Register (Email , Password , ......)  -> Token , Email , Display Name
        Task<UserDto> RegisterAsync(RegisterDto registerDto);


        //Check Email
        Task<bool> CheckEmailAsync(string email);

        //Get Current User
        Task<UserDto> GetCurrentUserAsync(string email);

        //Get Current User Address
        Task<AddressDto> GetCurrentUserAddress(string email);

        //Create Or Update Address
        Task<AddressDto> UpdateUserAddress(string email , AddressDto addressDto);

    }
}
