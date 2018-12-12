import { EntityState } from '@ngrx/entity';

/** Describes one Actor (person or entity able to take political actions) */
export interface Actor {
  /** calculated from actorId and officeId */
  id: string;
  personId: string;
  officeId: string;
  title: string;
  description: string;
  termStarted: Date;
  termEnded: Date;
}

/** Represents one Actor search result with a unique ID
 * usable by Actor Selection UI */
export class ActorSearchResult {
  /** should be equal to item.id */
  id: string;
  isSelected: boolean;
  item: Actor;
}

export interface ActorState extends EntityState<Actor> {}
