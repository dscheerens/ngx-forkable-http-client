import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CustomHeaderInterceptor implements HttpInterceptor {
    public intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
        return next.handle(req.clone({ headers: req.headers.set('X-Custom-Header', 'Foo') }));
    }
}

@Injectable({ providedIn: 'root' })
export class AnotherCustomHeaderInterceptor implements HttpInterceptor {
    public intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
        return next.handle(req.clone({ headers: req.headers.set('X-Another-Custom-Header', 'Bar') }));
    }
}
