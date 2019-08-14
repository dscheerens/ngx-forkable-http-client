import { Injectable, Inject, Optional } from '@angular/core';
import { HTTP_INTERCEPTORS, HttpBackend, HttpClient, HttpHandler, HttpInterceptor } from '@angular/common/http';

import { createInterceptorHandler } from './http-interceptor-handler';

@Injectable({ providedIn: 'root' })
export class ForkableHttpClient extends HttpClient {

    constructor(
        @Inject(HttpBackend) private readonly baseHandler: HttpHandler,
        @Optional() @Inject(HTTP_INTERCEPTORS) private readonly interceptors: HttpInterceptor[]
    ) {
        super(createInterceptorHandler(baseHandler, interceptors || []));
    }

    public fork(...interceptors: HttpInterceptor[]): ForkableHttpClient {
        return new ForkableHttpClient(this.baseHandler, [...this.interceptors, ...interceptors]);
    }

}

export function forkHttpClient(parent: ForkableHttpClient, ...interceptors: HttpInterceptor[]): ForkableHttpClient {
    return parent.fork(...interceptors);
}
