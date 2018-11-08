import { createFeatureSelector } from '@ngrx/store';

import { ReportCardsState, State } from './report-cards.model';

export const selectReportCards = createFeatureSelector<State, ReportCardsState>(
  'reportcards'
);
