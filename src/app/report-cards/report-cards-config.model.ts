/** Data types consumed by UI elements including the report card configuration tree
 * and various search result lists.
 */
import { Actor } from './actors.model';
import { ActorInfoProviderScorecard, ActorInfoProviderScorecardAction } from './provider-scorecards.model';

/** data model for the report cards configuration tree */

export interface ActorInfoProviderScorecardConfig extends ActorInfoProviderScorecard {
    actions: Array<ActorInfoProviderScorecardAction>;
}

export interface ActorConfig extends Actor {
    scorecards: Array<ActorInfoProviderScorecardConfig>;
}

/** Represents one Actor search result with a unique ID
 * usable by Actor Selection UI */
export class ActorSearchResult {
    /** should be equal to item.id */
    id: string;
    isSelected: boolean;
    item: Actor;
}

/** Represents one provider scorecard search result with a unique ID
* usable by Provider Selection UI */
export class ActorInfoProviderScorecardSearchResult {
    /** should be equal to item.id */
    id: string;
    index: number;
    isSelected: boolean;
    item: ActorInfoProviderScorecardConfig;
}

/** Represents one provider scorecard Action info search result with a unique ID
 * usable in Provider Selection by "action description" UI
 * TODO: investigate if we could have just one SearchResult class with item of type A | B | C */
export class ActorProviderScorecardActionSearchResult {
    /** should be equal to item.id */
    id: string;
    index: number;
    isSelected: boolean;
    item: ActorInfoProviderScorecardAction;
}

