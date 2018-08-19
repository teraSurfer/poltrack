import { createFeatureSelector, ActionReducerMap } from '@ngrx/store';

import { todosReducer } from './todos/todos.reducer';
import { TodosState } from './todos/todos.model';

export const FEATURE_NAME = 'examples';

export const reducers: ActionReducerMap<ExamplesState> = {
  todos: todosReducer
};

export const selectExamples = createFeatureSelector<any, ExamplesState>(
  FEATURE_NAME
);

export interface ExamplesState {
  todos: TodosState;
}
