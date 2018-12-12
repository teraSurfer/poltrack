import { createSelector } from '@ngrx/store';

import { ReportCardsState, selectReportCards } from './report-cards.state';
import { providerScorecardAdapter } from './provider-scorecards.reducer';

const { selectIds, selectAll } = providerScorecardAdapter.getSelectors();

export const selectProviderScorecards = createSelector(
  selectReportCards,
  (state: ReportCardsState) => state.providerscorecards
);

export const selectAllProviderScorecards = createSelector(selectProviderScorecards, selectAll);

export const selectProviderScorecardsIds = createSelector(selectProviderScorecards, selectIds);
