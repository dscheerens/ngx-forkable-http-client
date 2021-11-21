import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';
import { FORKED_HTTP_CLIENT, HTTP_CLIENT } from './app.module';

interface HttpbinResponse {
  headers: {
    [key: string]: string
  }
}

@Component({
  selector: 'app-root',
  template: `
    <pre>{{ output_a }}</pre>
    <hr />
    <pre>{{ output_b }}</pre>
  `
})
export class AppComponent implements OnInit {
  title = 'demo';

  public output_a: string = '';
  public output_b: string = '';

  constructor(
    @Inject(HTTP_CLIENT) private httpClientA: HttpClient,
    @Inject(FORKED_HTTP_CLIENT) private httpClientB: HttpClient
    ) { }

  ngOnInit(): void {
    this.output_a = this.output_b = 'loading ...';
    this.httpClientA.get<HttpbinResponse>('http://httpbin.org/get')
    .pipe(map(this.filterCustomHeaders))
    .subscribe((customHeaders: { [k: string]: string }) => {
        this.output_a = JSON.stringify(customHeaders, null, 2);
      });

    this.httpClientB.get<HttpbinResponse>('http://httpbin.org/get')
    .pipe(map(this.filterCustomHeaders))
    .subscribe((customHeaders: { [k: string]: string }) => {
      this.output_b = JSON.stringify(customHeaders, null, 2);
    })
  }

  private filterCustomHeaders (data: HttpbinResponse): { [k: string]: string } {
    return Object.fromEntries(
      Object.entries(data.headers)
        .filter(([key, _]) => key.toLowerCase().includes('custom')));
  }
  
}
