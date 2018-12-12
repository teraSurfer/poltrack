import { Actor } from './actors.model';
import { ActorInfoProviderScorecard, ActorInfoProviderScorecardActionInfo } from './provider-scorecards.model';

/** data model for the report cards configuration tree */

export interface ActorInfoProviderScorecardConfig extends ActorInfoProviderScorecard {
    actionsInfo: Array<ActorInfoProviderScorecardActionInfo>;
}

export interface ActorConfig extends Actor {
    infoProviderScorecards: Array<ActorInfoProviderScorecardConfig>;
}
