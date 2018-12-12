import { EntityState } from '@ngrx/entity';

/** Describes one scorecard from an information provider for a given actor.
 * (actor = politician;
 * provider = person or entity providing opinion on political actions;
 * scorecard = collection of opinions from one provider)
 */
export interface ActorInfoProviderScorecard {
    /** calculated from actorId, providerId, scorecardId, and scorecard start and end date */
    id: string;
    /** actor entity ID */
    actorId: string;
    providerId: string;
    scorecardId: string;
    title: string;
    description: string;
    scorecardStartDate: Date;
    scorecardEndDate: Date;
  }

  /** Represents one provider scorecard search result with a unique ID
   * usable by Provider Selection UI */
  export class ActorInfoProviderScorecardSearchResult {
    /** should be equal to item.id */
    id: string;
    index: number;
    isSelected: boolean;
    item: ActorInfoProviderScorecard;
  }

  export interface ActorInfoProviderScorecardActionInfo {
    /** calculated from actorInfoProviderScorecardId, actionId, actionInfoId */
    id: string;
    actorInfoProviderScorecardId: string;
    actionId: string;
    actionTypeDescription: string;
    actionInfoId: string;
    title: string;
    descriptionType: string; // (should be enum; default: HTML5)
    description: string;
}

  /** Represents one provider scorecard Action info search result with a unique ID
   * usable by Provider Selection UI
   * TODO: investigate if we could have just one SearchResult class with item of type A | B | C */
  export class ActorInfoProviderScorecardActionInfoSearchResult {
    /** should be equal to item.id */
    id: string;
    index: number;
    isSelected: boolean;
    item: ActorInfoProviderScorecardActionInfo;
  }


  export interface ActorInfoProviderScorecardState extends EntityState<ActorInfoProviderScorecard> {}
