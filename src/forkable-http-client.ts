import { Injectable, Inject, Optional } from '@angular/core';
import { HTTP_INTERCEPTORS, HttpBackend, HttpClient, HttpInterceptor } from '@angular/common/http';

import { createInterceptorHandler } from './http-interceptor-handler';

@Injectable()
export class ForkableHttpClient extends HttpClient {

    constructor(private backend: HttpBackend, @Optional() @Inject(HTTP_INTERCEPTORS) private interceptors: HttpInterceptor[]) {
        super(createInterceptorHandler(backend, interceptors || []));
    }

    public fork(...interceptors: HttpInterceptor[]): ForkableHttpClient {
        return new ForkableHttpClient(this.backend, [...this.interceptors, ...interceptors]);
    }

}

export function forkHttpClient(parent: ForkableHttpClient, ...interceptors: HttpInterceptor[]): ForkableHttpClient {
    return parent.fork(...interceptors);
}
