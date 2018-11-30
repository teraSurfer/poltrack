import { Injectable } from '@angular/core';
import { Action, select, Store } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { tap, withLatestFrom } from 'rxjs/operators';

import { LocalStorageService } from '@app/core';

import { State } from './report-cards.state';
import { ProviderScorecardActionTypes } from './provider-scorecards.actions';
import { selectProviderScorecards } from './provider-scorecards.selectors';

export const PROVIDERSCORECARDS_KEY = 'REPORTCARDS.PROVIDERSCORECARDS';

@Injectable()
export class ProviderScorecardsEffects {
  constructor(
    private actions$: Actions<Action>,
    private store: Store<State>,
    private localStorageService: LocalStorageService
  ) {}

  @Effect({ dispatch: false })
  persistProviderScorecards = this.actions$.pipe(
    ofType(ProviderScorecardActionTypes.UPSERT_ONE, ProviderScorecardActionTypes.DELETE_ONE),
    withLatestFrom(this.store.pipe(select(selectProviderScorecards))),
    tap(([actions, providerScorecardsState]) =>
      this.localStorageService.setItem(PROVIDERSCORECARDS_KEY, providerScorecardsState)
    )
  );
}
