import { ActionReducerMap, createFeatureSelector } from '@ngrx/store';
import { AppState } from '@app/core';

import { actorReducer } from './actors.reducer';
import { ActorState } from './actors.model';
import { providerScorecardReducer } from './provider-scorecards.reducer';
import { ProviderScorecardState } from './provider-scorecards.model';

export const FEATURE_NAME = 'reportcards';
export const selectReportCards = createFeatureSelector<State, ReportCardsState>(
  FEATURE_NAME
);

export const reducers: ActionReducerMap<ReportCardsState> = {
  actors: actorReducer,
  providerScorecards: providerScorecardReducer
};

export interface ReportCardsState {
  actors: ActorState;
  providerScorecards: ProviderScorecardState;
}

export interface State extends AppState {
  reportcards: ReportCardsState;
}
