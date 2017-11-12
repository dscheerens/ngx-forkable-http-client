# Fork your HTTP client: supporting non-global HTTP interceptors in Angular

Most AngularJS developers are probably familiar with the concept of [HTTP interceptors](https://docs.angularjs.org/api/ng/service/$http): a mechanism for modifying request and responses.
This feature is commonly used for tasks such as global authentication, logging and error handling.

When Angular 2 was introduced it became clear there (initially) would be [no equivalent for HTTP interceptors](https://github.com/angular/angular/issues/2684).
In order to support similar functionality in Angular 2 you had to create your own HTTP service which took care of intercepting the request and responses.
While that approach worked fine, it was not a very convenient one.
Alternatively you could have used a third party Angular library to bring back HTTP interceptor support.

With the release of Angular 4.3 the new [`HttpClient`](https://angular.io/api/common/http/HttpClient) was introduced, which deprecated the [`Http`](https://v4.angular.io/api/http/Http) service.
Apart from a much improved API the new HTTP client also brought back the beloved HTTP interceptors.
So, everything is good now... right?

## The problem with Angular's HTTP interceptors

While we can be happy about the fact that the interceptors are supported again, I feel like the Angular core team fell into the same trap as in AngularJS: the interceptors are global!
Before looking at a (possible) solution, first let's see what does it mean for an interceptor to be global and why global interceptors can be a problem.

If you take a look at the official documentation for Angular's `HttpClient` you'll find a section called '[_Intercepting **all** requests or responses_](https://angular.io/guide/http#intercepting-all-requests-or-responses)', that describes how to use HTTP interceptors.
Notice that the word **_all_** has been highlighted; that is what is meant with global interceptors.
Whenever you define a HTTP interceptor it will intercept all requests and responses.
For many application that presumably is not a problem, however there are enough cases in which this is not desirable.

A common case in which the global HTTP interceptors actually become a problem is when your application uses several different and unrelated API's.
These API's probably require different authentication and error handling.
With global interceptors, these interceptors need to be aware that they might possibly intercept messages which they should ignore.
For example if you have created an authentication interceptor for API **X**, then it is not correct if it also sets an authentication header for requests that target API **Y**.

This is often solved in HTTP interceptors by explicitly checking the URL of the messages to determine which ones should be ignored.
Although that works, it is not a very elegant solution as it clutters the interceptor with additional logic.
Also, often the exact URLs of the API endpoints are not known in advance.
Maybe the application is deployed in different environments or the interceptor could be part of an isolated reusable module.
In those situations the URLs are not known in advance and you need to implement a mechanism to provide this information from outside of the interceptor.

Another problem that can occur with global HTTP interceptors is that it can lead to circular dependencies.
Recently I encountered such a situation when developing an interceptor that in case of a [_401 Unauthorized_](https://httpstatuses.com/401) response would automatically redirect the user to login screen of a single sign on service.
The interceptor made use of an authentication service, that in turn had a dependency on `HttpClient`.
A simplified dependency graph of the situation is shown below.

![Dependency graph diagram](dependency-diagram.svg)

Angular's `HttpClient` has a [transitive dependency](https://github.com/angular/angular/blob/5.0.1/packages/common/http/src/module.ts#L120-L127) on the `HTTP_INTERCEPTORS` multi-provider.
Since the `AutoLoginHttpInterceptor` was defined as a global HTTP interceptor, by means of a provider for the `HTTP_INTERCEPTORS` token, this resulted in a cyclic dependency graph.
The irony of this situation is that the `AutoLoginHttpInterceptor` should not even have have intercepted messages for the `AuthenticationService`.
Simply checking the URLs of the messages in this case did not help to solve the circular dependency problem.
Another solution is needed here.

## Non-global HTTP interceptors

Hopefully, by now it is clear why global HTTP interceptors can be a bit of a problem.
The obvious solution is to start using _non-global_ / _local_ HTTP interceptors.
Although that sounds easy, Angular currently does not offer an easy way to set them up like that.

When starting to look into the problem of how to support non-global interceptors, the goal was to do so without having to introduce a wrapper class for the `HttpClient` as was needed before Angular 4.3.
In the ideal solution services still should have been able to use `HttpClient`, together with an `@Inject` decorator as a qualifier to be able to select the right HTTP client.
An example of how this is supposed to look like is shown below:

```Typescript
import { InjectionToken, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export const HTTP_CLIENT_A = new InjectionToken<HttpClient>('HTTP_CLIENT_A');
export const HTTP_CLIENT_B = new InjectionToken<HttpClient>('HTTP_CLIENT_B');

export class ServiceA {
  constructor(@Inject(HTTP_CLIENT_A) private httpClient: HttpClient) { }
  // ...
}

export class ServiceB {
  constructor(@Inject(HTTP_CLIENT_B) private httpClient: HttpClient) { }
  // ...
}
```

The injection tokens make sure that it is possible to inject different instances of the `HttpClient`, where each client has its own set of HTTP interceptors.
So the next problem to solve is how to create the different instances of the `HttpClient`.
The answer can be found by studing the [`HttpClient` constructor](https://github.com/angular/angular/blob/5.0.1/packages/common/http/src/client.ts#L64), which apparently needs an [`HttpHandler`](https://angular.io/api/common/http/HttpHandler).
By looking at the source of the [`HttpClientModule`](https://github.com/angular/angular/blob/5.0.1/packages/common/http/src/module.ts#L103-L135) we obtain the final piece of the puzzle: how to construct a `HttpHandler` from a set of HTTP interceptors.
Putting all the pieces together results in a solution that looks like this:

```TypeScript
import { Inject, Optional } from '@angular/core';
import {
  HTTP_INTERCEPTORS,
  HttpBackend,
  HttpClient,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest
} from '@angular/common/http'
import { Observable } from 'rxjs/Observable';

// Copied from: https://github.com/angular/angular/blob/5.0.1/packages/common/http/src/module.ts#L28-L35
function interceptingHandler(
    backend: HttpBackend, interceptors: HttpInterceptor[] | null = []): HttpHandler {
  if (!interceptors) {
    return backend;
  }
  return interceptors.reduceRight(
      (next, interceptor) => new HttpInterceptorHandler(next, interceptor), backend);
}

// Copied from: https://github.com/angular/angular/blob/5.0.1/packages/common/http/src/interceptor.ts#L52-L58
class HttpInterceptorHandler implements HttpHandler {
  constructor(private next: HttpHandler, private interceptor: HttpInterceptor) {}

  handle(req: HttpRequest<any>): Observable<HttpEvent<any>> {
    return this.interceptor.intercept(req, this.next);
  }
}

export class HttpClientA extends HttpClient {
  constructor(
    backend: HttpBackend,
    @Optional() @Inject(HTTP_INTERCEPTORS) interceptors: HttpInterceptor[],
    localInterceptorX: LocalInterceptorX,
    localInterceptorY: LocalInterceptorY
  ) {
    super(interceptingHandler(backend, [...(interceptors || []), localInterceptorX, localInterceptorY]));
  }
}

export class HttpClientB extends HttpClient {
  constructor(
    backend: HttpBackend,
    @Optional() @Inject(HTTP_INTERCEPTORS) interceptors: HttpInterceptor[],
    localInterceptorZ: LocalInterceptorZ,
  ) {
    super(interceptingHandler(backend, [...(interceptors || []), LocalInterceptorZ]));
  }
}
```

The `interceptingHandler` function and `HttpInterceptorHandler` class have to be copied from the Angular source code since they are not exported as members from the public API.

Finally we need to define the providers for these HTTP clients and their injection tokens in a module.
An example of how to do so is shown in the code snippet below:

```Typescript
@NgModule({
  imports: [ HttpClientModule ],
  poviders: [
    // Local interceptors:
    LocalInterceptorX,
    LocalInterceptorY,
    LocalInterceptorZ,

     // HTTP clients:
    { provide: HTTP_CLIENT_A, useClass: HttpClientA },
    { provide: HTTP_CLIENT_B, useClass: HttpClientB }
  ]
})
export class MyModule { }
```

Together these three code snippets form a working example of how to add non-global HTTP interceptors in an application.
