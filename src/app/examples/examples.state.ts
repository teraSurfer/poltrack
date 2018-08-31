import { createFeatureSelector, ActionReducerMap } from '@ngrx/store';

import { AppState } from '@app/core';

import { todosReducer } from './todos/todos.reducer';
import { TodosState } from './todos/todos.model';

export const FEATURE_NAME = 'examples';

export const reducers: ActionReducerMap<ExamplesState> = {
  todos: todosReducer
};

export const selectExamples = createFeatureSelector<State, ExamplesState>(
  FEATURE_NAME
);

export interface ExamplesState {
  todos: TodosState;
}

export interface State extends AppState {
  examples: ExamplesState;
}
