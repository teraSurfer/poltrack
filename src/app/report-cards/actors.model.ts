import { EntityState } from '@ngrx/entity';

/** Describes one Actor (person or entity able to take political actions) */
export interface Actor {
  /** calculated from personId and officeId */
  id: string;
  personId: string;
  officeId: string;
  title: string;
  description: string;
  termStarted: Date;
  termEnded: Date;
}

export interface ActorState extends EntityState<Actor> { }
