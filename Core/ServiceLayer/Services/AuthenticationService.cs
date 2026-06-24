using AutoMapper;
using DomainLayer.Exceptions;
using DomainLayer.Models.IdentityModels;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using ServiceAbstractionlayer;
using Shared.DTOS.IdentityDtos;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace ServiceLayer.Services
{
    public class AuthenticationService
        (UserManager<ApplicationUser> _userManager,
        IConfiguration _configuration,
        IMapper _mapper) 
        : IAuthenticationService
    {

        #region Login & Register
        public async Task<UserDto> LoginAsync(LoginDto loginDto)
        {
            //Check If Email Exist
            var user = await _userManager.FindByEmailAsync(loginDto.Email);
            if (user is null) throw new UserNotFoundException(loginDto.Email);
            //Check Pass
            var isPassValid = await _userManager.CheckPasswordAsync(user, loginDto.Password);
            if (isPassValid)
            {
                return new UserDto()
                {
                    Email=user.Email!,
                    DisplayName=user.DisplayName,
                    Token=await CreateTokenAsync(user)
                };
            }
            else throw new UnauthorizedException();
        }

        public async Task<UserDto> RegisterAsync(RegisterDto registerDto)
        {
            //Convert Dto To Entity
            var user = new ApplicationUser()
            {
                DisplayName=registerDto.DisplayName,
                Email=registerDto.Email,
                PhoneNumber=registerDto.PhoneNumber,
                UserName=registerDto.UserName ?? registerDto.Email.Split("@")[0],
            };
            var res = await _userManager.CreateAsync(user, registerDto.Password);
            if (res.Succeeded) return new UserDto()
            {
                DisplayName=user.DisplayName,
                Email = user.Email,
                Token=await CreateTokenAsync(user)
            };
            else
            {
                var errors = res.Errors.Select(e => e.Description).ToList();
                throw new BadRequestException(errors);
            }
        }


        private async Task<string> CreateTokenAsync(ApplicationUser user)
        {
            var claims = new List<Claim>()
            {
                new Claim( ClaimTypes.Email,user.Email!),
                new Claim( ClaimTypes.Name,user.UserName!),
                new Claim( ClaimTypes.NameIdentifier,user.Id!),
            };
            var roles = await _userManager.GetRolesAsync(user);
            foreach (var role in roles)
                claims.Add(new Claim(ClaimTypes.Role, role));

            var secretKey = _configuration["JwtOptions:SecretKey"];
            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey));

            var creds = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _configuration["JwtOptions:Issuer"],
                audience: _configuration["JwtOptions:Audience"],
                claims: claims,
                expires: DateTime.Now.AddHours(1),
                signingCredentials: creds
                );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }


        #endregion


        public async Task<bool> CheckEmailAsync(string email)
        {
            var user =await _userManager.FindByEmailAsync(email);
            return user is not null;
        }

        public async Task<UserDto> GetCurrentUserAsync(string email)
        {
            var user = await _userManager.FindByEmailAsync(email) 
                                  ?? throw new UserNotFoundException(email) ;

            return new UserDto() { Email =user.Email!, DisplayName =user.DisplayName, Token =await CreateTokenAsync(user) };

        }



        public async Task<AddressDto> GetCurrentUserAddress(string email)
        {
            var user = await _userManager.Users
                .Include(u => u.Address)
                .FirstOrDefaultAsync(u=>u.Email==email) ?? //
                throw new UserNotFoundException(email);

            //if (user.Address is not null)
                return _mapper.Map<AddressDto>(user.Address);
            //else throw new AddressNotFoundException(user.UserName!);

        }


        public async Task<AddressDto> UpdateUserAddress(string email, AddressDto addressDto)
        {
            var user = await _userManager.Users
                          .Include(u => u.Address).FirstOrDefaultAsync() ??
                          throw new UserNotFoundException(email);

            if(user.Address is not null)//Update
            {
                user.Address.FirstName=addressDto.FirstName;
                user.Address.LastName=addressDto.LastName;
                user.Address.City=addressDto.City;
                user.Address.Street=addressDto.Street;
                user.Address.Country=addressDto.Country;

            }
            else//Add
            {
                user.Address=_mapper.Map<Address>(addressDto);
            }
            await _userManager.UpdateAsync(user);
            return _mapper.Map<AddressDto>(user.Address);

        }

     

  
     

    }
}
