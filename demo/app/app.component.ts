import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { Observable, OperatorFunction } from 'rxjs';
import { map, publishReplay, refCount, startWith } from 'rxjs/operators';

import { HTTP_CLIENT_A, HTTP_CLIENT_B } from './http-clients';
import { Memoized } from './memoized.decorator';

interface HttpbinResponse {
    headers: {
        [key: string]: string;
    };
}

@Component({
    selector: 'app-root',
    template: `
        <pre>{{ outputA$ | async }}</pre>
        <hr />
        <pre>{{ outputB$ | async }}</pre>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
    constructor(
        @Inject(HTTP_CLIENT_A) private readonly httpClientA: HttpClient,
        @Inject(HTTP_CLIENT_B) private readonly httpClientB: HttpClient,
    ) {}

    @Memoized public get outputA$(): Observable<string> {
        return this.httpClientA.get<HttpbinResponse>('http://httpbin.org/get').pipe(
            responseToText(),
        );
    }

    @Memoized public get outputB$(): Observable<string> {
        return this.httpClientB.get<HttpbinResponse>('http://httpbin.org/get').pipe(
            responseToText(),
        );
    }
}

function responseToText(): OperatorFunction<HttpbinResponse, string> {
    return (source$) => source$.pipe(
        map((response) => {
            const customHeaders = Object.fromEntries(
                Object.entries(response.headers)
                    .filter(([key, _]) => key.toLowerCase().includes('custom')),
            );

            return JSON.stringify(customHeaders, null, 2);
        }),
        startWith('Loading...'),
        publishReplay(1),
        refCount(),
    );
}
