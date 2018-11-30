import { createEntityAdapter, EntityAdapter } from '@ngrx/entity';
import { ProviderScorecard, ProviderScorecardState } from './provider-scorecards.model';
import { ProviderScorecardActionTypes, ProviderScorecardActions } from './provider-scorecards.actions';

export function sortByTitle(a: ProviderScorecard, b: ProviderScorecard): number {
  return a.title.localeCompare(b.title);
}

export const providerScorecardAdapter: EntityAdapter<ProviderScorecard> = createEntityAdapter<ProviderScorecard>({
  sortComparer: sortByTitle
});

export const initialState: ProviderScorecardState = providerScorecardAdapter.getInitialState({
  ids: [],
  entities: {}
});

export function providerScorecardReducer(
  state: ProviderScorecardState = initialState,
  action: ProviderScorecardActions
): ProviderScorecardState {
  switch (action.type) {
    case ProviderScorecardActionTypes.UPSERT_ONE:
      return providerScorecardAdapter.upsertOne(action.payload.providerScorecard, state);

    case ProviderScorecardActionTypes.DELETE_ONE:
      return providerScorecardAdapter.removeOne(action.payload.id, state);

    default:
      return state;
  }
}
