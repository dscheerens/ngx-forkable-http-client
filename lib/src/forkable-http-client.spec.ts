import { InjectionToken, Inject, Injectable } from '@angular/core';
import { TestBed, inject } from '@angular/core/testing';
import { HTTP_INTERCEPTORS, HttpBackend, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Observable } from 'rxjs';

import { ForkableHttpClient, forkHttpClient } from './forkable-http-client';

const INTERCEPTOR_SEQUENCE_JOURNAL = new InjectionToken<string[]>('INTERCEPTOR_SEQUENCE_JOURNAL');

abstract class TestInterceptor implements HttpInterceptor {
    constructor(
        private readonly id: string,
        @Inject(INTERCEPTOR_SEQUENCE_JOURNAL) private readonly journal: string[],
    ) {}

    public intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
        this.journal.push(this.id);

        return next.handle(request);
    }
}

@Injectable()
class TestInterceptorA extends TestInterceptor {
    constructor(@Inject(INTERCEPTOR_SEQUENCE_JOURNAL) journal: string[]) { super('A', journal); }
}

@Injectable()
class TestInterceptorB extends TestInterceptor {
    constructor(@Inject(INTERCEPTOR_SEQUENCE_JOURNAL) journal: string[]) { super('B', journal); }
}

@Injectable()
class TestInterceptorC extends TestInterceptor {
    constructor(@Inject(INTERCEPTOR_SEQUENCE_JOURNAL) journal: string[]) { super('C', journal); }
}

@Injectable()
class TestInterceptorD extends TestInterceptor {
    constructor(@Inject(INTERCEPTOR_SEQUENCE_JOURNAL) journal: string[]) { super('D', journal); }
}

@Injectable()
class TestInterceptorE extends TestInterceptor {
    constructor(@Inject(INTERCEPTOR_SEQUENCE_JOURNAL) journal: string[]) { super('E', journal); }
}

@Injectable()
class TestInterceptorF extends TestInterceptor {
    constructor(@Inject(INTERCEPTOR_SEQUENCE_JOURNAL) journal: string[]) { super('F', journal); }
}

describe('forkable http client', () => {
    let baseHttpClient: ForkableHttpClient;
    let interceptorSequenceJournal: string[];
    let testInterceptorC: TestInterceptor;
    let testInterceptorD: TestInterceptor;
    let testInterceptorE: TestInterceptor;
    let testInterceptorF: TestInterceptor;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientTestingModule,
            ],
            providers: [
                { provide: INTERCEPTOR_SEQUENCE_JOURNAL, useFactory: () => [] },
                { provide: HTTP_INTERCEPTORS, useClass: TestInterceptorA, multi: true },
                { provide: HTTP_INTERCEPTORS, useClass: TestInterceptorB, multi: true },
                TestInterceptorC,
                TestInterceptorD,
                TestInterceptorE,
                TestInterceptorF,
            ],
        });
    });

    beforeEach(inject([ForkableHttpClient], (injected: ForkableHttpClient) => baseHttpClient = injected));
    beforeEach(inject([INTERCEPTOR_SEQUENCE_JOURNAL], (injected: string[]) => interceptorSequenceJournal = injected));
    beforeEach(inject([TestInterceptorC], (injected: TestInterceptor) => testInterceptorC = injected));
    beforeEach(inject([TestInterceptorD], (injected: TestInterceptor) => testInterceptorD = injected));
    beforeEach(inject([TestInterceptorE], (injected: TestInterceptor) => testInterceptorE = injected));
    beforeEach(inject([TestInterceptorF], (injected: TestInterceptor) => testInterceptorF = injected));

    it('supports the global HTTP interceptors', () => {
        baseHttpClient.get('/foo').subscribe();
        expect(interceptorSequenceJournal).toEqual(['A', 'B']);
    });

    it('can be instantiated when no global HTTP interceptors are present', inject([HttpBackend], (backend: HttpBackend) => {
        new ForkableHttpClient(backend, null).get('/foo').subscribe();
        expect(interceptorSequenceJournal).toEqual([]);
    }));

    it('can be forked without additional HTTP interceptors', () => {
        baseHttpClient.fork().get('/foo').subscribe();
        expect(interceptorSequenceJournal).toEqual(['A', 'B']);
    });

    it('supports forking with additional interceptors', () => {
        baseHttpClient.fork(testInterceptorC, testInterceptorD).get('/foo').subscribe();
        expect(interceptorSequenceJournal).toEqual(['A', 'B', 'C', 'D']);
    });

    it('not modify the parent when forking', () => {
        baseHttpClient.fork(testInterceptorC, testInterceptorD).get('/foo').subscribe();
        expect(interceptorSequenceJournal).toEqual(['A', 'B', 'C', 'D']);

        interceptorSequenceJournal.splice(0);

        baseHttpClient.get('/foo').subscribe();
        expect(interceptorSequenceJournal).toEqual(['A', 'B']);
    });

    it('can be transitively forked', () => {
        baseHttpClient.fork(testInterceptorC, testInterceptorD).fork(testInterceptorE, testInterceptorF).get('/foo').subscribe();
        expect(interceptorSequenceJournal).toEqual(['A', 'B', 'C', 'D', 'E', 'F']);

        interceptorSequenceJournal.splice(0);

        baseHttpClient.fork(testInterceptorE, testInterceptorF).fork(testInterceptorC, testInterceptorD).get('/foo').subscribe();
        expect(interceptorSequenceJournal).toEqual(['A', 'B', 'E', 'F', 'C', 'D']);
    });

    it('can be forked through the `forkHttpClient` function', () => {
        forkHttpClient(baseHttpClient, testInterceptorC, testInterceptorD).get('/foo').subscribe();
        expect(interceptorSequenceJournal).toEqual(['A', 'B', 'C', 'D']);
    });

});
