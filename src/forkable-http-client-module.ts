import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { ForkableHttpClient } from './forkable-http-client';

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
