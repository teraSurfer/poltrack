import { Person } from '@app/core/auth/models/person.model';
import { Action } from '@ngrx/store';

export const AUTH_KEY = 'AUTH';

export enum AuthActionTypes {
  LOGIN = '[Auth] Login',
  LOGOUT = '[Auth] Logout'
}

export class ActionAuthLogin implements Action {
  readonly type = AuthActionTypes.LOGIN;

  constructor(
    public payload: { person: Person }
  ) { }
}

// tslint:disable-next-line:max-classes-per-file
export class ActionAuthLogout implements Action {
  readonly type = AuthActionTypes.LOGOUT;
}

export type AuthActions = ActionAuthLogin | ActionAuthLogout;

export const initialState: AuthState = {
  isAuthenticated: false,
  person: { name: 'unknown name', email: 'unknown email', id: '' }
};

export const selectorAuth = state => state.auth;

export function authReducer(
  state: AuthState = initialState,
  action: AuthActions
): AuthState {
  switch (action.type) {
    case AuthActionTypes.LOGIN:
      return { ...state, isAuthenticated: true, person: action.payload.person };

    case AuthActionTypes.LOGOUT:
      return { ...state, isAuthenticated: false, person: undefined };

    default:
      return state;
  }
}

export interface AuthState {
  isAuthenticated: boolean;
  person: Person;
}
