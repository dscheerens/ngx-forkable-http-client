import { HttpClient } from '@angular/common/http';
import { InjectionToken } from '@angular/core';
import { httpClient } from 'ngx-forkable-http-client';

import { AnotherCustomHeaderInterceptor, CustomHeaderInterceptor } from './interceptors';

export const HTTP_CLIENT_A = new InjectionToken<HttpClient>('HTTP_CLIENT_A', {
    providedIn: 'root',
    factory: httpClient().with(CustomHeaderInterceptor),
});

export const HTTP_CLIENT_B = new InjectionToken<HttpClient>('HTTP_CLIENT_B', {
    providedIn: 'root',
    factory: httpClient().with(AnotherCustomHeaderInterceptor),
});
