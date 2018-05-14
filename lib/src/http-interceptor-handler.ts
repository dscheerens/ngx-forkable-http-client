import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';

import { Observable } from 'rxjs';

export function createInterceptorHandler(baseHandler: HttpHandler, interceptors: HttpInterceptor[]): HttpHandler {
    return interceptors.reduceRight((next, interceptor) => new HttpInterceptorHandler(next, interceptor), baseHandler);
}

export class HttpInterceptorHandler implements HttpHandler {

    constructor(
        private readonly next: HttpHandler,
        private readonly interceptor: HttpInterceptor
    ) { }

    public handle(request: HttpRequest<any>): Observable<HttpEvent<any>> {
        return this.interceptor.intercept(request, this.next);
    }

}
