import { ActionReducerMap, createFeatureSelector } from '@ngrx/store';
import { AppState } from '@app/core';

import { actorReducer } from './actors.reducer';
import { ActorState } from './actors.model';
import { providerScorecardReducer } from './provider-scorecards.reducer';
import { ActorProviderScorecardState } from './provider-scorecards.model';

export const FEATURE_NAME = 'reportcards';
export const selectReportCards = createFeatureSelector<State, ReportCardsState>(
  FEATURE_NAME
);

export const reducers: ActionReducerMap<ReportCardsState> = {
  actors: actorReducer,
  providerscorecards: providerScorecardReducer
};

export interface ReportCardsState {
  actors: ActorState;
  providerscorecards: ActorProviderScorecardState;
}

export interface State extends AppState {
  reportcards: ReportCardsState;
}
