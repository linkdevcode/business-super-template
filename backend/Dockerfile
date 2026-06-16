# syntax=docker/dockerfile:1

# ---------------------------------------------
# Build stage: restore + build solution
# ---------------------------------------------
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

# Copy solution + csproj first for better layer caching
COPY backend/Template.sln backend/Template.sln
COPY backend/Template.API/Template.API.csproj backend/Template.API/Template.API.csproj
COPY backend/Template.Infrastructure/Template.Infrastructure.csproj backend/Template.Infrastructure/Template.Infrastructure.csproj
COPY backend/Template.Core/Template.Core.csproj backend/Template.Core/Template.Core.csproj

RUN dotnet restore backend/Template.sln

# Copy the remaining source
COPY backend/ backend/

RUN dotnet build backend/Template.sln -c Release -o /app/build

# ---------------------------------------------
# Publish stage: produce a minimal output
# ---------------------------------------------
FROM build AS publish
RUN dotnet publish backend/Template.API/Template.API.csproj -c Release -o /app/publish /p:UseAppHost=false

# ---------------------------------------------
# Runtime stage: small ASP.NET Core runtime image
# ---------------------------------------------
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS final
WORKDIR /app

# Render/Railway friendly default; can be overridden by env
ENV ASPNETCORE_URLS=http://+:8080
EXPOSE 8080

COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "Template.API.dll"]

