import { Injectable } from '@angular/core';
import { HttpBackend, HttpClient, HttpInterceptor } from '@angular/common/http';

import { createInterceptorHandler } from './http-interceptor-handler';

@Injectable()
export class ForkableHttpClient extends HttpClient {

    constructor(private backend: HttpBackend, private interceptors: HttpInterceptor[]) {
        super(createInterceptorHandler(backend, interceptors));
    }

    public fork(...interceptors: HttpInterceptor[]): ForkableHttpClient {
        return new ForkableHttpClient(this.backend, [...this.interceptors, ...interceptors]);
    }

}
