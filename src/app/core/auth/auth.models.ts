import { Person } from './person.model';

export interface AuthState {
  isAuthenticated: boolean;
  person: Person;
}
