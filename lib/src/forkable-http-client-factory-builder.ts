import { InjectionToken, Type, inject } from '@angular/core';
import { HttpInterceptor } from '@angular/common/http';
import { ForkableHttpClient } from './forkable-http-client';

/** Token that can be used for injecting values that conform to the `HttpInterceptor` interface. */
export type HttpInterceptorInjectionToken = Type<HttpInterceptor> | InjectionToken<HttpInterceptor>;

/** Factory function that creates a new `ForkableHttpClient` instance. */
export type ForkableHttpClientFactory = (() => ForkableHttpClient) & {
    /**
     * Adds extra interceptors to the HTTP client that will be created when the factory function is called.
     *
     * @param   interceptors HTTP interceptors that should be added.
     * @returns              Factory function itself.
     */
    with(...interceptors: HttpInterceptorInjectionToken[]): ForkableHttpClientFactory;
};

/**
 * Creates a factory function that can be used for the factory of a self-providing `InjectionToken` for `ForkableHttpClient`.
 *
 * @param   parent Optional parent `ForkableHttpClient` which should be forked to create the new `ForkableHttpClient` instance. If no
 *                 argument is provided for this parameter, then the default 'root' ForkableHttpClient will be used.
 * @returns        A factory function that creates and returns a new `ForkableHttpClient` instance. The factory function also has a `with`
 *                 function that can be called to add extra interceptors to the new HTTP client.
 */
export function httpClient(parent?: InjectionToken<ForkableHttpClient>): ForkableHttpClientFactory {
    const interceptors: HttpInterceptorInjectionToken[] = [];

    const factory = (() => {

        return inject(parent || ForkableHttpClient).fork(...interceptors.map((interceptor) => inject(interceptor)));

    }) as ForkableHttpClientFactory;

    factory.with = (...interceptorsToAdd: HttpInterceptorInjectionToken[]) => {
        interceptors.push(...interceptorsToAdd);

        return factory;
    };

    return factory;
}
