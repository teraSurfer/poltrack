import { ActionReducerMap, createFeatureSelector } from '@ngrx/store';
import { AppState } from '@app/core';

import { actorReducer } from './actors.reducer';
import { ActorState } from './actors.model';

export const FEATURE_NAME = 'reportcards';
export const selectReportCards = createFeatureSelector<State, ReportCardsState>(
  FEATURE_NAME
);
export const reducers: ActionReducerMap<ReportCardsState> = {
  actors: actorReducer
  // providers: providerReducer
};

export interface ReportCardsState {
  actors: ActorState;
  // providers: ProviderState;
}

export interface State extends AppState {
  reportcards: ReportCardsState;
}
