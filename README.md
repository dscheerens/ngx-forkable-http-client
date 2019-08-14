[![Build Status](https://api.travis-ci.org/dscheerens/ngx-forkable-http-client.svg?branch=master)](https://travis-ci.org/dscheerens/ngx-forkable-http-client) [![NPM Version](https://img.shields.io/npm/v/ngx-forkable-http-client.svg)](https://www.npmjs.com/package/ngx-forkable-http-client)

# Forkable HTTP client extension for Angular 6.0+

This Angular module provides a `ForkableHttpClient` class which is an extension of the [`HttpClient`](https://angular.io/api/common/http/HttpClient) that was introduced in Angular 4.3.
With the extension it becomes possible to fork HTTP clients to create new ones.
In the process of forking a `ForkableHttpClient` you can specify a number of additional [`HttpInterceptor`](https://angular.io/api/common/http/HttpInterceptor) instances that will be used by the new HTTP client.
This enables you to easily support non-global HTTP interceptors.
Furthermore it allows you employ a hierarchically structured approach in setting up the HTTP clients needed by the different services of your application.
The latter is very useful when your application needs to use multiple external API's exposed through HTTP endpoints.

A detailed explanation of the concepts behind this module can be found in the following article: _"[Fork your HTTP client: supporting non-global HTTP interceptors in Angular](https://github.com/dscheerens/ngx-forkable-http-client/blob/master/concept.md)"_

## Installation

Start by installing the `ngx-forkable-http-client` NPM package:

```
npm install --save ngx-forkable-http-client
```

After having installed the `ngx-forkable-http-client` package you might need to update your project configuration depending on the build tools you use, e.g. _SystemJS_ or _Karma_.
The `ngx-forkable-http-client` package is published in the [Angular Package Format](https://docs.google.com/document/d/1CZC2rcpxffTDfRDs6p1cfbmKNLA6x5O-NtkJglDaBVs/preview).

## Usage

To make use of this package begin by defining an [`InjectionToken`](https://angular.io/api/core/InjectionToken) for each of the `HttpClient` forks.

Example:

```Typescript
import { InjectionToken } from '@angular/core';
import { ForkableHttpClient } from 'ngx-forkable-http-client';

export const MY_REST_API_HTTP_CLIENT =
  new InjectionToken<ForkableHttpClient>('MY_REST_API_HTTP_CLIENT');

export const EXTERNAL_API_X_HTTP_CLIENT =
  new InjectionToken<ForkableHttpClient>('EXTERNAL_API_X_HTTP_CLIENT');

export const EXTERNAL_API_Y_HTTP_CLIENT =
  new InjectionToken<ForkableHttpClient>('EXTERNAL_API_Y_HTTP_CLIENT');
```

Use these injection tokens as a qualifier to inject the correct `HttpClient` in your services, e.g.:

```Typescript
import { Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export class MyRestApiService {
  constructor(
    @Inject(MY_REST_API_HTTP_CLIENT) private httpClient: HttpClient
  ) { /* ... */ }
}

export class ServiceThatUsesExternalApis {
  constructor(
    @Inject(EXTERNAL_API_X_HTTP_CLIENT) private httpClientForApiX: HttpClient,
    @Inject(EXTERNAL_API_Y_HTTP_CLIENT) private httpClientForApiY: HttpClient
  ) { /* ... */ }
}
```

You can use these injected HTTP clients in the exact same way as you would do with the default (non-qualified) `HttpClient`.
The only difference is that the qualified versions may have additional HTTP interceptors.

The final step is to define the providers for the qualified HTTP clients.
Assuming you have a number of HTTP interceptors which shouldn't be defined globally, a typical setup looks like the following:

```TypeScript
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { ForkableHttpClient, forkHttpClient } from 'ngx-forkable-http-client';

@NgModule({
  imports: [
    HttpClientModule
  ],

  providers: [
    // Define the providers for the non-global interceptors.
    MyAuthenticationHttpInterceptor,
    LoggingHttpInterceptor,
    ErrorHandlerHttpInterceptor,
    AnotherHttpInterceptor

    // Define the HTTP clients.
    {
      provide: MY_REST_API_HTTP_CLIENT,
      useFactory: forkHttpClient,
      deps: [ ForkableHttpClient, MyAuthenticationHttpInterceptor, LoggingHttpInterceptor ]
    }, {
      provide: EXTERNAL_API_X_HTTP_CLIENT,
      useFactory: forkHttpClient,
      deps: [ ForkableHttpClient, ErrorHandlerHttpInterceptor ]
    }, {
      provide: EXTERNAL_API_Y_HTTP_CLIENT,
      useFactory: forkHttpClient,
      deps: [ ForkableHttpClient, AnotherHttpInterceptor ]
    }
  ]
})
export class AppModule {
}
```

The example above shows you need to do two things to setup the forked HTTP clients:

1. Define the non-global HTTP interceptors.
   This is a simple as providing them as [`TypeProvider`](https://angular.io/api/core/TypeProvider) entries in the `providers` array.
   Be sure not to define them using the [`HTTP_INTERCEPTORS`](https://angular.io/api/common/http/HTTP_INTERCEPTORS) injection token, as that will result in them being used as global interceptors.

2. Define the providers for the qualified HTTP clients.
   For this you have to use the `forkHttpClient` factory function.
   The first parameter of this function specifies the parent `ForkableHttpClient` from which a new client should be created.
   In addition you can provide zero or more [`HttpInterceptor`](https://angular.io/api/common/http/HttpInterceptor) instances as arguments for the `forkHttpClient` function.
   These will then be added to new HTTP client as non-global interceptors.
   The arguments for the factory function are provided as an array via the `deps` property.

What the example above does not show is how to hierarchically structure the HTTP clients.
All clients in the example fork off from the default client, which can be seen by the first element of the deps array being: `ForkableHttpClient`.
If instead you would like to fork off another qualified HTTP client (which needs to be a `ForkableHttpClient`), then use the following definition of your provider:

```TypeScript
import { Inject, NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { forkHttpClient } from 'ngx-forkable-http-client';

@NgModule({
  imports: [
    HttpClientModule
  ],
  providers: [
    CacheHttpInterceptor,
    {
      provide: MY_REST_API_HTTP_CLIENT_WITH_CACHING,
      useFactory: forkHttpClient,
      deps: [ [new Inject(MY_REST_API_HTTP_CLIENT)], CacheHttpInterceptor ]
    }
  ]
})
export class AnotherModule {
}
```

As can be seen from the example above, a new client is defined that forks off from the `MY_REST_API_HTTP_CLIENT`, inheriting all of the parent's interceptors and obtaining the additional `CacheHttpInterceptor`.
