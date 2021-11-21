import { HttpClient, HttpClientModule, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable, InjectionToken, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { Observable } from 'rxjs';
import { httpClient } from 'ngx-forkable-http-client';
import { AppComponent } from './app.component';

export const HTTP_CLIENT = new InjectionToken<HttpClient>('HTTP_CLIENT');
export const FORKED_HTTP_CLIENT = new InjectionToken<HttpClient>('FORKED_HTTP_CLIENT');
const INTERCEPTOR_TOKEN = new InjectionToken<HttpInterceptor>('INTERCEPTOR_TOKEN');

@Injectable({
  providedIn: 'root'
})
class CustomHeaderInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req.clone({headers: req.headers.set('X-Custom-Header', 'Foo')}));
  }
}

@Injectable()
class AnotherCustomHeaderInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req.clone({headers: req.headers.set('X-Another-Custom-Header', 'Bar')}));
  }
}

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule
  ],
  providers: [
    {
      provide: HTTP_CLIENT,
      useFactory: httpClient().with(CustomHeaderInterceptor)
    },
    {
      provide: FORKED_HTTP_CLIENT,
      useFactory: httpClient(HTTP_CLIENT).with(INTERCEPTOR_TOKEN)
    },
    {
      provide: INTERCEPTOR_TOKEN,
      useClass: AnotherCustomHeaderInterceptor
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }