import { Injectable, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, Subject, BehaviorSubject } from 'rxjs';
import {
  map,
  distinctUntilChanged,
  debounceTime,
  tap,
  finalize,
  switchMap,
  flatMap
} from 'rxjs/operators';
import { UiActorSearchResult, ActorSearchResult } from '@app/core';
import { getHash } from '@app/shared';

/** Implements Report Cards input parameters search including Actor and Information Providers search */
@Injectable({
  providedIn: 'root'
})
export class ReportCardsService implements OnDestroy {
  constructor(private httpClient: HttpClient) {
    this.actorSearchString$
      .pipe(
        debounceTime(700),
        distinctUntilChanged(),
        tap(() => this.isActorSearchInProgress$.next(true)),
        switchMap(searchString =>
          this.httpClient
            .get<Array<ActorSearchResult>>(
              `http://localhost:7071/api/ActorSearch?q=${searchString}`
            )
            .pipe(
              tap(() => console.log('ActorSearch http request')),
              map((data: any) => toSearchResultItems(data))
            )
        )
      )
      .subscribe(searchResult => {
        this.actorSearchResults$.next(searchResult);
        this.isActorSearchInProgress$.next(false);
      });
  }

  public actorSearchResults$: BehaviorSubject<
    Array<UiActorSearchResult>
  > = new BehaviorSubject(new Array<UiActorSearchResult>());
  public isActorSearchInProgress$: BehaviorSubject<
    boolean
  > = new BehaviorSubject<boolean>(false);
  public actorSearchString$ = new Subject<string>();

  ngOnDestroy(): void {
    throw new Error('Method not implemented.');
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  private log(message: string) {
    console.log(`ReportCardsService: ${message}`);
  }
}

function toSearchResultItems(data: {
  content: Array<any>;
  meta: any;
}): Array<UiActorSearchResult> {
  const resultItemsArrays: Array<UiActorSearchResult> = new Array<
    UiActorSearchResult
  >();

  data.content.forEach(item => {
    const actorSearchResult = item as ActorSearchResult;
    const uiActorSearchResult: UiActorSearchResult = {
      id: getHash(actorSearchResult.actorId + actorSearchResult.officeId),
      isSelected: false,
      item: {
        actorId: actorSearchResult.actorId,
        officeId: actorSearchResult.officeId,
        title: actorSearchResult.title,
        description: actorSearchResult.description,
        termStarted: new Date(actorSearchResult.termStarted),
        termEnded: new Date(actorSearchResult.termEnded)
      }
    };
    resultItemsArrays.push(uiActorSearchResult);
  });

  return resultItemsArrays;
}
