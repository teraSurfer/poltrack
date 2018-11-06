import { createEntityAdapter, EntityAdapter } from '@ngrx/entity';
import { Actor, ActorState } from './actors.model';
import { ActorActions, ActorActionTypes } from './actors.actions';

export function sortByTitle(a: Actor, b: Actor): number {
  return a.title.localeCompare(b.title);
}

export const actorAdapter: EntityAdapter<Actor> = createEntityAdapter<Actor>({
  sortComparer: sortByTitle
});

export const initialState: ActorState = actorAdapter.getInitialState({
  ids: [],
  entities: {}
});

export function actorReducer(
  state: ActorState = initialState,
  action: ActorActions
): ActorState {
  switch (action.type) {
    case ActorActionTypes.UPSERT_ONE:
      return actorAdapter.upsertOne(action.payload.actor, state);

    case ActorActionTypes.DELETE_ONE:
      return actorAdapter.removeOne(action.payload.id, state);

    default:
      return state;
  }
}
