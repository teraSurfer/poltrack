import { AuthState } from './auth.models';
import { AuthActions, AuthActionTypes } from './auth.actions';

export const initialState: AuthState = {
  isAuthenticated: false,
  person: { name: 'unknown name', email: 'unknown email', id: '' }
};

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
