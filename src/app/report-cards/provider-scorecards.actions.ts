import { Action } from '@ngrx/store';
import { ProviderScorecard } from './provider-scorecards.model';

export enum ProviderScorecardActionTypes {
  UPSERT_ONE = '[ProviderScorecards] Upsert One',
  DELETE_ONE = '[ProviderScorecards] Delete One'
}

export class ActionProviderScorecardsUpsertOne implements Action {
  readonly type = ProviderScorecardActionTypes.UPSERT_ONE;
  constructor(readonly payload: { providerScorecard: ProviderScorecard }) {}
}

export class ActionProviderScorecardsDeleteOne implements Action {
  readonly type = ProviderScorecardActionTypes.DELETE_ONE;
  constructor(readonly payload: { id: string }) {}
}

export type ProviderScorecardActions = ActionProviderScorecardsUpsertOne | ActionProviderScorecardsDeleteOne;
