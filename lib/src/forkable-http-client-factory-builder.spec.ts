import { Injectable, InjectionToken, Type } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { HttpBackend, HttpInterceptor } from '@angular/common/http';
import { EMPTY, Observable } from 'rxjs';

import { httpClient } from './forkable-http-client-factory-builder';
import { ForkableHttpClient } from './forkable-http-client';

export const BASE = new InjectionToken<ForkableHttpClient>('BASE', {
    providedIn: 'root',
    factory: httpClient(),
});

@Injectable({ providedIn: 'root' })
export class InterceptorA implements HttpInterceptor {
    public intercept(): Observable<never> { return EMPTY; }
}

const INTERCEPTOR_B = new InjectionToken<HttpInterceptor>('INTERCEPTOR_B', {
    providedIn: 'root',
    factory: () => ({} as any), // tslint:disable-line:no-any
});

const INTERCEPTOR_C = new InjectionToken<HttpInterceptor>('INTERCEPTOR_C', {
    providedIn: 'root',
    factory: () => ({} as any), // tslint:disable-line:no-any
});

export const HTTP_CLIENT_A = new InjectionToken<ForkableHttpClient>('HTTP_CLIENT_A', {
    providedIn: 'root',
    factory: httpClient(BASE).with(InterceptorA),
});

export const HTTP_CLIENT_B = new InjectionToken<ForkableHttpClient>('HTTP_CLIENT_B', {
    providedIn: 'root',
    factory: httpClient(HTTP_CLIENT_A).with(INTERCEPTOR_B, INTERCEPTOR_C),
});

describe('forkable http client factory builder', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                { provide: HttpBackend, useValue: {} },
            ],
        });
    });

    it('support forking off the root HttpClient', () => {
        const base = inject(BASE);

        expect(base).toBeDefined();
        expect(interceptorsOf(base)).toEqual([]);
    });

    it('support forking off other HttpClients', () => {
        const httpClientA = inject(HTTP_CLIENT_A);

        expect(httpClientA).toBeDefined();
        expect(interceptorsOf(httpClientA)).toEqual([inject(InterceptorA)]);

        const httpClientB = inject(HTTP_CLIENT_B);
        expect(httpClientB).toBeDefined();
        expect(interceptorsOf(httpClientB)).toEqual([inject(InterceptorA), inject(INTERCEPTOR_B), inject(INTERCEPTOR_C)]);
    });
});

function inject<T>(token: Type<T> | InjectionToken<T>): T {
    return TestBed.inject(token);
}

function interceptorsOf(target: ForkableHttpClient): HttpInterceptor[] {
    return (target as unknown as { interceptors: HttpInterceptor[] }).interceptors;
}
