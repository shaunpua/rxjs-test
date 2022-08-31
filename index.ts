import './style.css';

import {
  of,
  map,
  Observable,
  fromEvent,
  filter,
  debounceTime,
  distinctUntilChanged,
  switchMap,
  catchError,
  EMPTY,
  timer,
  tap,
} from 'rxjs';

import { fromFetch } from 'rxjs/fetch';
import { switchAll, takeUntil } from 'rxjs/operators';

const api = 'https://api.jikan.moe/v4/anime?q=';

const textbox = document.getElementById('search');
const textbox$ = fromEvent(textbox, 'keyup');

//closed textbox after 10seconds can no longer call API
const timer$ = timer(10000).pipe(tap(() => console.log('finshihed stream')));

textbox$
  .pipe(
    filter((evt) => (evt.target as HTMLInputElement).value.length >= 3),
    debounceTime(300),
    map((evt) => (evt.target as HTMLInputElement).value),
    distinctUntilChanged(),
    map((value) => api + value),
    switchMap((endpoint) =>
      fromFetch(endpoint).pipe(
        //switchMap((response) => response.json()),
        map((res) => res.json()),
        switchAll(),
        map((res) => res.data[0]),
        catchError((err) => EMPTY)
      )
    ),
    takeUntil(timer$)
  )
  .subscribe(console.log);

//EMPTY ends steam NEVER keeps stream
// NO use nested subscribe!!!!

// of('World')
//   .pipe(map((name) => `Hello, ${name}!`))
//   .subscribe(console.log);

// Open the console in the bottom right to see results.
