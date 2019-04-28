import { createEntityAdapter, EntityAdapter } from '@ngrx/entity';
import { ActorProviderScorecard, ActorProviderScorecardState } from './provider-scorecards.model';
import { ProviderScorecardActionTypes, ProviderScorecardActions } from './provider-scorecards.actions';

export function sortByTitle(a: ActorProviderScorecard, b: ActorProviderScorecard): number {
  return a.title.localeCompare(b.title);
}

export const providerScorecardAdapter: EntityAdapter<ActorProviderScorecard> = createEntityAdapter<ActorProviderScorecard>({
  sortComparer: sortByTitle
});

export const initialState: ActorProviderScorecardState = providerScorecardAdapter.getInitialState({
  ids: [],
  entities: {}
});

export function providerScorecardReducer(
  state: ActorProviderScorecardState = initialState,
  action: ProviderScorecardActions
): ActorProviderScorecardState {
  switch (action.type) {
    case ProviderScorecardActionTypes.UPSERT_ONE:
      return providerScorecardAdapter.upsertOne(action.payload.providerscorecard, state);

    case ProviderScorecardActionTypes.DELETE_ONE:
      return providerScorecardAdapter.removeOne(action.payload.id, state);

    default:
      return state;
  }
}
