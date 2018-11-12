import { Action } from '@ngrx/store';
import { ReportCardsState } from '@app/report-cards/report-cards.state';
import { ActorSearchResult } from './actors.model';

export enum ReportCardsActionTypes {
  ACTOR_SEARCH = '[ReportCards] Actor Search',
  ACTOR_SEARCH_SUCCESS = '[ReportCards] Actor Search Success',
  ACTOR_SEARCH_ERROR = '[ReportCards] Actor Search Error',
  ACTOR_SELECTED = '[ReportCards] Actor Selected',
  ACTOR_UNSELECTED = '[ReportCards] Actor Unselected',
  PERSIST = '[ReportCards] Persist'
}

export class ActionReportCardsActorSearch implements Action {
  readonly type = ReportCardsActionTypes.ACTOR_SEARCH;

  constructor(readonly payload: { searchString: string }) {}
}

export class ActionReportCardsActorSearchSuccess implements Action {
  readonly type = ReportCardsActionTypes.ACTOR_SEARCH_SUCCESS;

  constructor(
    readonly payload: { searchResultArray: Array<ActorSearchResult> }
  ) {}
}

export class ActionReportCardsActorSearchError implements Action {
  readonly type = ReportCardsActionTypes.ACTOR_SEARCH_ERROR;

  constructor(readonly payload: { error: any }) {}
}

export class ActionReportCardsActorSelected implements Action {
  readonly type = ReportCardsActionTypes.ACTOR_SELECTED;

  constructor(readonly payload: { actor: ActorSearchResult }) {}
}

export class ActionReportCardsActorUnselected implements Action {
  readonly type = ReportCardsActionTypes.ACTOR_UNSELECTED;

  constructor(readonly payload: { actor: ActorSearchResult }) {}
}

export class ActionReportCardsPersist implements Action {
  readonly type = ReportCardsActionTypes.PERSIST;

  constructor(readonly payload: { settings: ReportCardsState }) {}
}

export type ReportCardsActions =
  | ActionReportCardsPersist
  | ActionReportCardsActorSearch
  | ActionReportCardsActorSearchSuccess
  | ActionReportCardsActorSearchError
  | ActionReportCardsActorSelected
  | ActionReportCardsActorUnselected;
