/** Represents information about one political action from one info provider for one politician (actor) */
export interface ActorProviderScorecardAction {
    /** calculated from actorProviderScorecardId, actionId, documentId */
    id: string;
    /** ID of the scorecard entity this action's entity is related to */
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
