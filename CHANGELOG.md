# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [3.0.0](https://github.com/dscheerens/ngx-forkable-http-client/compare/v2.1.1...v3.0.0) (2021-09-10)


### ⚠ BREAKING CHANGES

* **deps:** peer dependencies have been updated to require at least Angular 12.0.0
* **deps:** due to the updated dependencies this package now requires at least Angular 8.

* **deps:** update dependencies ([fb2b3de](https://github.com/dscheerens/ngx-forkable-http-client/commit/fb2b3dee601907cf44ce01ac7bbe71ce6f038ff1))
* **deps:** upgrade to Angular 12 ([6db372d](https://github.com/dscheerens/ngx-forkable-http-client/commit/6db372dd8a1c6280329a77423e1e9696b157b939))

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
