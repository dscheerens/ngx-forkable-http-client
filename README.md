[![Build Status](https://api.travis-ci.org/dscheerens/ngx-forkable-http-client.svg?branch=master)](https://travis-ci.org/dscheerens/ngx-forkable-http-client) [![NPM Version](https://img.shields.io/npm/v/ngx-forkable-http-client.svg)](https://www.npmjs.com/package/ngx-forkable-http-client)

# Forkable HTTP client extension for Angular 4.3+

This Angular module provides a `ForkableHttpClient` class which is an extension of the [`HttpClient`](https://angular.io/api/common/http/HttpClient) that was introduced in Angular 4.3.
With the extension it becomes possible to fork HTTP clients to create a new ones.
In the process of forking a `ForkableHttpClient` you can specify a number of additional [`HttpInterceptor`](https://angular.io/api/common/http/HttpInterceptor)s that will be used by the new HTTP client.
This enables you to easily support non-global HTTP interceptors.
Furthermore it allows you employ a hierarchically structured approach in setting up the HTTP clients needed by the different services of your application.
The latter is very useful when your application needs to use multiple external API's exposed through HTTP endpoints.

## Installation

Start by installing the `ngx-forkable-http-client` NPM package:

```
npm install --save ngx-forkable-http-client
```

Configure your build tooling, e.g. _SystemJS_ or _Karma_, if necessary to include one of the distribution bundles provided by this package.
The following bundles are available:

* An ECMAScript 6 bundle (used for tree shaking): `node_modules/ngx-forkable-http-client/bundles/ngx-forkable-http-client.js`
* An ECMAScript 5 bundle in ES6 module (ESM) format: `node_modules/ngx-forkable-http-client/bundles/ngx-forkable-http-client.es5.js`
* An ECMAScript 5 bundle in universal module (UMD) format: `node_modules/ngx-forkable-http-client/bundles/ngx-forkable-http-client.umd.js`

## Usage

_(TODO)_

## Concepts

_(TODO)_
