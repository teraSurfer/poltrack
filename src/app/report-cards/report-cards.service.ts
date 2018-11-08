import { Injectable, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, Subject, BehaviorSubject } from 'rxjs';
import {
  map,
  distinctUntilChanged,
  debounceTime,
  tap,
  switchMap
} from 'rxjs/operators';
import { Store, select } from '@ngrx/store';

import { getHash, isValidDateString } from '@app/shared';
import { ActorSearchResult, Actor } from './actors.model';
import { selectAllActors } from './actors.selectors';
import { ActionActorsUpsertOne, ActionActorsDeleteOne } from './actors.actions';

/** Implements Report Cards input parameters search including Actor and Information Providers search */
@Injectable({
  providedIn: 'root'
})
export class ReportCardsService implements OnDestroy {
  constructor(
    private readonly httpClient: HttpClient,
    private readonly store: Store<{}>
  ) {
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
              map((data: any) => this.toSearchResultItems(data))
            )
        )
      )
      .subscribe(searchResult => {
        this.actorSearchResults$.next(searchResult);
        this.isActorSearchInProgress$.next(false);
      });

    this.actors$ = this.store.pipe(select(selectAllActors));
  }

  public actors$: Observable<Array<Actor>>;

  public actorSearchResults$: BehaviorSubject<
    Array<ActorSearchResult>
  > = new BehaviorSubject(new Array<ActorSearchResult>());
  public isActorSearchInProgress$: BehaviorSubject<
    boolean
  > = new BehaviorSubject<boolean>(false);
  public actorSearchString$ = new Subject<string>();

  public deleteActor(id: string): any {
    this.store.dispatch(new ActionActorsDeleteOne({ id: id }));
  }

  public onDeletePersonClicked(event) {
    this.deleteActor(event.currentTarget.value);
  }

  public upsertActor(actor: Actor): any {
    this.store.dispatch(new ActionActorsUpsertOne({ actor: actor }));
  }

  public ngOnDestroy(): void {
    throw new Error('Method not implemented.');
  }

  private toSearchResultItems(data: {
    content: Array<any>;
    meta: any;
  }): Array<ActorSearchResult> {
    const resultItemsArrays: Array<ActorSearchResult> = new Array<
      ActorSearchResult
    >();

    data.content.forEach(item => {
      const calculatedId: string = String(
        getHash(item.actorId + item.officeId)
      );

      const calculatedTermStarted: Date = isValidDateString(item.termStarted)
        ? new Date(item.termStarted)
        : undefined;

      const calculatedTermEnded: Date = isValidDateString(item.termEnded)
        ? new Date(item.termEnded)
        : undefined;

      const uiSearchResultItem: ActorSearchResult = {
        id: calculatedId,
        isSelected: false,
        item: {
          id: calculatedId,
          actorId: item.actorId,
          officeId: item.officeId,
          title: item.title,
          description: item.description,
          termStarted: calculatedTermStarted,
          termEnded: calculatedTermEnded
        }
      };
      resultItemsArrays.push(uiSearchResultItem);
    });

    return resultItemsArrays;
  }
}