using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Mvc;
using CartZone.Factories;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Microsoft.OpenApi.Models;

namespace CartZone.Extentions
{
    public static class ServiceRegisteration
    {
        public static IServiceCollection AddSwaggerService(this IServiceCollection Services) {
         
            Services.AddEndpointsApiExplorer();
            Services.AddSwaggerGen(options =>
            {
                options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme()
                {
                    In=ParameterLocation.Header,
                    Name="Authorization",
                    Type=SecuritySchemeType.ApiKey,
                    Scheme="Bearer",
                    Description="Enter 'Bearer' Followed By Space And Your Token"
                });
                options.AddSecurityRequirement(new OpenApiSecurityRequirement()
                {
                    {
                        new OpenApiSecurityScheme()
                        {
                            Reference=new OpenApiReference()
                            {
                                Id="Bearer",
                                Type=ReferenceType.SecurityScheme
                            }
                        },
                        new string[]{}
                    }
                });
            });
            return Services;

        }

        public static IServiceCollection AddWebApplicationServices(this IServiceCollection Services) {

            Services.Configure<ApiBehaviorOptions>((options) =>
            {
                options.InvalidModelStateResponseFactory=ApiResponseFactory.GenerateApiValidationErrorResponse;
            });

            return Services;

        }

        public static IServiceCollection AddJwtService(this IServiceCollection Services , IConfiguration configuration)
        {

            Services.AddAuthentication(configOptions =>
            {
                configOptions.DefaultAuthenticateScheme=JwtBearerDefaults.AuthenticationScheme;
                configOptions.DefaultChallengeScheme=JwtBearerDefaults.AuthenticationScheme;
            }).AddJwtBearer(options =>
            {
                options.TokenValidationParameters=new TokenValidationParameters()
                {
                    ValidateIssuer=true,
                    ValidIssuer=configuration["JwtOptions:Issuer"],

                    ValidateAudience=true,
                    ValidAudience=configuration["JwtOptions:Audience"],

                    ValidateLifetime=true,
                    IssuerSigningKey=new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuration["JwtOptions:SecretKey"]))
                };
            });

            return Services;
        }
    }
}
