import { ActionReducer } from '@ngrx/store';

export function debug(reducer: ActionReducer<any>): ActionReducer<any> {
  return (state, action) => {
    const newState = reducer(state, action);
    console.log(`[DEBUG] action: ${action.type}`, {
      payload: (action as any).payload,
      oldState: state,
      newState
    });
    return newState;
  };
}
