import { Action } from '@ngrx/store';
import { Actor } from './actors.model';

export enum ActorActionTypes {
  UPSERT_ONE = '[Actors] Upsert One',
  DELETE_ONE = '[Actors] Delete One'
}

export class ActionActorsUpsertOne implements Action {
  readonly type = ActorActionTypes.UPSERT_ONE;
  constructor(readonly payload: { actor: Actor }) {}
}

export class ActionActorsDeleteOne implements Action {
  readonly type = ActorActionTypes.DELETE_ONE;
  constructor(readonly payload: { id: string }) {}
}

export type ActorActions = ActionActorsUpsertOne | ActionActorsDeleteOne;
