import { EntityState } from '@ngrx/entity';

/** Describes one scorecard from an information provider for a given actor.
 * (actor = politician;
 * provider = person or entity providing opinion on political actions;
 * scorecard = collection of opinions from one provider)
 */
export interface ActorProviderScorecard {
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
  /** Maximum weight assigned to an action in the scorecard */
  scorecardActionMaxWeight: number;
  /** Number of actions included in this scorecard */
  scorecardActionCount: number;
}

export interface ActorProviderScorecardState extends EntityState<ActorProviderScorecard> { }

export interface ActorProviderScorecardAction {
  /** calculated from actorProviderScorecardId, actionId, documentId */
  id: string;
  actorProviderScorecardId: string;
  /** Action (vote, cosponsorship, etc.) ID */
  actionId: string;
  /** Enum indicating the action type (vote, cospon, etc.) */
  actionTypes: number;
  /** preferredPositions enum indicating provider's position on this action (supported or opposed) */
  preferredPositions: number;
  /** action weight */
  actionWeight: number;
  documentId: string;
  documentUpdateDate: string;
  documentTitle: string;
  /** the first 140 chars of description without markup */
  documentContentFragment: string;
}

export interface ActorProviderScorecardActionState extends EntityState<ActorProviderScorecardAction> { }
