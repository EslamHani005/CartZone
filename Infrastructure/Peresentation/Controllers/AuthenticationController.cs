using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ServiceAbstractionlayer;
using Shared.DTOS.IdentityDtos;
using System.Security.Claims;

namespace Peresentation.Controllers
{
    [ApiController]
    [Route("api/[Controller]")]

    public class AuthenticationController(IServiceManager _serviceManager): ControllerBase
    {

        //Login  Post BaseUrl/api/Authentication/Login
        [HttpPost("Login")]
        public async Task<ActionResult<UserDto>> Login(LoginDto loginDto)
        {
            var user =await _serviceManager.AuthenticationService.LoginAsync(loginDto);
            return Ok(user);
        }

        //Login  Post BaseUrl/api/Authentication/Register
        [HttpPost("Register")]
        public async Task<ActionResult<UserDto>> Register(RegisterDto registerDto)
        {
            var user = await _serviceManager.AuthenticationService.RegisterAsync(registerDto);
            return Ok(user);
        }


        [HttpGet("CheckEmail")]
        public async Task<ActionResult<bool>> CheckEmail(string email)
        {
            var res =await _serviceManager.AuthenticationService.CheckEmailAsync(email);
            return Ok(res);
        }

        [Authorize]
        [HttpGet("CurrentUser")]
        public async Task<ActionResult<UserDto>> GetCurrentUser()
        {
            var email = User.FindFirstValue(ClaimTypes.Email);
            var appUser = await _serviceManager.AuthenticationService.GetCurrentUserAsync(email!);
            return Ok(appUser);
        }

        [Authorize]
        [HttpGet("Address")]
        public async Task<ActionResult<AddressDto>> GetCurrentUserAddress()
        {
            var email = User.FindFirstValue(ClaimTypes.Email);
            var address = await _serviceManager.AuthenticationService.GetCurrentUserAddress(email!);
            return Ok(address);
        }
        [Authorize]
        [HttpPut("Address")]
        public async Task<ActionResult<AddressDto>> UpdateCurrentUserAddress(AddressDto address)
        {
            var email = User.FindFirstValue(ClaimTypes.Email);
            var updatedAddress = await _serviceManager.AuthenticationService.UpdateUserAddress(email! , address);
            return Ok(updatedAddress);
        }

    }
}
