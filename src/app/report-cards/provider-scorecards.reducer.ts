import { createEntityAdapter, EntityAdapter } from '@ngrx/entity';
import { ActorInfoProviderScorecard, ActorInfoProviderScorecardState } from './provider-scorecards.model';
import { ProviderScorecardActionTypes, ProviderScorecardActions } from './provider-scorecards.actions';

export function sortByTitle(a: ActorInfoProviderScorecard, b: ActorInfoProviderScorecard): number {
  return a.title.localeCompare(b.title);
}

export const providerScorecardAdapter: EntityAdapter<ActorInfoProviderScorecard> = createEntityAdapter<ActorInfoProviderScorecard>({
  sortComparer: sortByTitle
});

export const initialState: ActorInfoProviderScorecardState = providerScorecardAdapter.getInitialState({
  ids: [],
  entities: {}
});

export function providerScorecardReducer(
  state: ActorInfoProviderScorecardState = initialState,
  action: ProviderScorecardActions
): ActorInfoProviderScorecardState {
  switch (action.type) {
    case ProviderScorecardActionTypes.UPSERT_ONE:
      return providerScorecardAdapter.upsertOne(action.payload.providerscorecard, state);

    case ProviderScorecardActionTypes.DELETE_ONE:
      return providerScorecardAdapter.removeOne(action.payload.id, state);

    default:
      return state;
  }
}
