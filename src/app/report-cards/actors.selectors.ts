import { createSelector } from '@ngrx/store';

import { selectRouterState } from '@app/core';

import { actorAdapter } from './actors.reducer';
import { selectReportCards } from './report-cards.selectors';
import { ReportCardsState } from './report-cards.model';

const { selectEntities, selectAll } = actorAdapter.getSelectors();

export const selectActors = createSelector(
  selectReportCards,
  (state: ReportCardsState) => state.actors
);

export const selectAllActors = createSelector(selectActors, selectAll);
export const selectActorsEntities = createSelector(
  selectActors,
  selectEntities
);

export const selectSelectedActor = createSelector(
  selectActorsEntities,
  selectRouterState,
  (entities, params) => params && entities[params.state.params.id]
);
