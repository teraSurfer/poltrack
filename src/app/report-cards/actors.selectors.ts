import { createSelector } from '@ngrx/store';

import { selectRouterState } from '@app/core';

import { actorAdapter } from './actors.reducer';
import { ReportCardsState, selectReportCards } from './report-cards.state';

const { selectIds, selectEntities, selectAll } = actorAdapter.getSelectors();

export const selectActors = createSelector(
  selectReportCards,
  (state: ReportCardsState) => state.actors
);

export const selectAllActors = createSelector(selectActors, selectAll);

export const selectActorsEntities = createSelector(
  selectActors,
  selectEntities
);

export const selectActorsIds = createSelector(selectActors, selectIds);

export const selectSelectedActor = createSelector(
  selectActorsEntities,
  selectRouterState,
  (entities, params) => params && entities[params.state.params.id]
);
