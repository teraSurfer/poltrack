/** Represents one Actor search result item provided
 * by ActorSearch Azure function */
export interface ActorSearchResult {
  actorId: string;
  officeId: string;
  title: string;
  description: string;
  termStarted: Date;
  termEnded: Date;
}

/** Represents one Actor search result with a unique ID
 * usable by Actor Selection UI */
export class UiActorSearchResult {
  id: number;
  isSelected: boolean;
  item: ActorSearchResult;
}
