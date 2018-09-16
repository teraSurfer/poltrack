import { AppState, ActorSearchResult } from '@app/core';

export interface ReportCardsState {
  selectedActors: Array<ActorSearchResult>;
}

export interface State extends AppState {
  reportCards: ReportCardsState;
}
