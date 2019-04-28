import { Action } from '@ngrx/store';
import { ActorProviderScorecard } from './provider-scorecards.model';

export enum ProviderScorecardActionTypes {
  UPSERT_ONE = '[ProviderScorecards] Upsert One',
  DELETE_ONE = '[ProviderScorecards] Delete One'
}

export class ActionProviderScorecardsUpsertOne implements Action {
  readonly type = ProviderScorecardActionTypes.UPSERT_ONE;
  constructor(readonly payload: { providerscorecard: ActorProviderScorecard }) {}
}

export class ActionProviderScorecardsDeleteOne implements Action {
  readonly type = ProviderScorecardActionTypes.DELETE_ONE;
  constructor(readonly payload: { id: string }) {}
}

export type ProviderScorecardActions = ActionProviderScorecardsUpsertOne | ActionProviderScorecardsDeleteOne;
