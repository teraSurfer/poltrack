import { Injectable } from '@angular/core';
import { Action, select, Store } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { tap, withLatestFrom } from 'rxjs/operators';

import { LocalStorageService } from '@app/core';

import { State } from './report-cards.state';
import { selectActors } from './actors.selectors';
import { ActorActionTypes } from './actors.actions';

export const ACTORS_KEY = 'REPORTCARDS.ACTORS';

@Injectable()
export class ActorsEffects {
  constructor(
    private actions$: Actions<Action>,
    private store: Store<State>,
    private localStorageService: LocalStorageService
  ) {}

  @Effect({ dispatch: false })
  persistActors = this.actions$.pipe(
    ofType(ActorActionTypes.UPSERT_ONE, ActorActionTypes.DELETE_ONE),
    withLatestFrom(this.store.pipe(select(selectActors))),
    tap(([actions, actorsState]) =>
      this.localStorageService.setItem(ACTORS_KEY, actorsState)
    )
  );
}
