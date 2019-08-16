# Change Log

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

<a name="2.1.1"></a>
# [2.1.1](https://github.com/dscheerens/ngx-forkable-http-client/compare/v2.0.0...v2.1.1) (2019-08-15)


### Bug Fixes

* `ForkableHttpClient.fork` throwing an error when no global interceptors have been provided ([379eab4](https://github.com/dscheerens/ngx-forkable-http-client/commit/379eab4))


### Features

* add `httpClient` factory function for 'self-providing' `HttpClient` injection tokens ([9f51d40](https://github.com/dscheerens/ngx-forkable-http-client/commit/9f51d40))
* make `ForkableHttpClient` self-providing in the root injector (deprecates `ForkableHttpClientModule`) ([0fb0e8a](https://github.com/dscheerens/ngx-forkable-http-client/commit/0fb0e8a))



<a name="2.0.0"></a>
# [2.0.0](https://github.com/dscheerens/ngx-forkable-http-client/compare/v1.0.0...v2.0.0) (2018-05-14)


### Features

* support Angular 6 and RxJS 6 ([f62f2d0](https://github.com/dscheerens/ngx-forkable-http-client/commit/f62f2d0))


### BREAKING CHANGES

* This library now depends on **Angular** >=6.0.0, **RxJS** >=6.0.0 and **tslib** ^1.9.0



<a name="1.0.0"></a>
# 1.0.0 (2017-11-26)

### Initial release
