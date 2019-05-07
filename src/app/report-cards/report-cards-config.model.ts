/** Data types consumed by UI elements including the report card configuration components
 * and search result list component.
 */
import { Actor } from './actors.model';
import { ActorProviderScorecard } from './provider-scorecards.model';
import { ActorProviderScorecardAction } from './scorecard-actions.model';

/* REPORT CARDS CONFIGURATION DATA MODEL */
/* Data model for the report cards configuration is a hierarchical representation of
 * the three NgRx entities (Actor, ActorProviderScorecard, and ActorProviderScorecardAction):
 *
 * Array<ActorConfig>
 *     Array<ActorProviderScorecardConfig>
 *          Array<ActorProviderScorecardAction>
 *
 * This hierarchy gets updated every time the NgRx entities are updated.
 */

/** The top level of the report card configuration hierarchy.  It contains information about one
 * actor (politician) and scorecards available for this actor.
 */
export interface ActorConfig extends Actor {
    scorecards: Array<ActorProviderScorecardConfig>;
}

/** The second level of the report card configuration hierarchy contains information about one
 * scorecard (set of opinions about political actions from one information provider) and
 * actions (ActorProviderScorecardAction) included in this scorecard.
 * The NgRx entity ActorProviderScorecardAction is used directly as the actions are the lowest level
 * of the configuration hierarchy.
 */
export interface ActorProviderScorecardConfig extends ActorProviderScorecard {
    actions: Array<ActorProviderScorecardAction>;
}

/* SEARCH RESULTS DATA MODEL */
/* Represents data received from the back-end formatted to support selection and deselection of various items
* (actors, scorecards, actions) by the user. In response to user's actions, search results are stored
*  (or deleted from) the NgRx entities.
*/
/** Represents one Actor search result with a unique ID
 * usable by Actor Selection UI */
export class ActorSearchResult {
    /** should be equal to item.id */
    id: string;
    isSelected: boolean;
    item: Actor;
}

export interface ActorProviderScorecardSearchResultItem extends ActorProviderScorecard {
    actions: Array<ActorProviderScorecardAction>;
}

/** Represents one provider scorecard search result with a unique ID
* usable by Provider Selection UI */
export class ActorProviderScorecardSearchResult {
    /** should be equal to item.id */
    id: string;
    index: number;
    isSelected: boolean;
    item: ActorProviderScorecardSearchResultItem;
}
