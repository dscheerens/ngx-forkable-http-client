import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

/**
 * @deprecated `ForkableHttpClient` is now self-providing in root, so there is no more need for importing `ForkableHttpClientModule`.
 * Instead make sure the `HttpClientModule` is imported.
 */
@NgModule({
    imports: [
        HttpClientModule
    ]
})
export class ForkableHttpClientModule {

}
