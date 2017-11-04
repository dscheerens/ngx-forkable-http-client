import { Inject, NgModule, Optional } from '@angular/core';
import { HTTP_INTERCEPTORS, HttpBackend, HttpClientModule, HttpInterceptor } from '@angular/common/http';

import { ForkableHttpClient } from './forkable-http-client';

export function forkableHttpClientFactory(backend: HttpBackend, interceptors: HttpInterceptor[] | null = []): ForkableHttpClient {
    return new ForkableHttpClient(backend, interceptors || []);
}

@NgModule({
    imports: [
        HttpClientModule
    ],
    providers: [
        {
            provide: ForkableHttpClient,
            useFactory: forkableHttpClientFactory,
            deps: [HttpBackend, [new Optional(), new Inject(HTTP_INTERCEPTORS)]]
        }
    ]
})
export class ForkableHttpClientModule {

}
