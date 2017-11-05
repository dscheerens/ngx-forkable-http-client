import { NgModule } from '@angular/core';
import { HttpBackend, HttpClientModule, HttpInterceptor } from '@angular/common/http';

import { ForkableHttpClient } from './forkable-http-client';

export function forkableHttpClientFactory(backend: HttpBackend, interceptors: HttpInterceptor[] | null = []): ForkableHttpClient {
    return new ForkableHttpClient(backend, interceptors || []);
}

@NgModule({
    imports: [
        HttpClientModule
    ],
    providers: [
        ForkableHttpClient
    ]
})
export class ForkableHttpClientModule {

}
