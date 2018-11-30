import { EntityState } from '@ngrx/entity';

/** Describes one scorecard from an information Provider
 * (provider = person or entity providing opinion on political actions;
 * scorecard = collection of opinions from one provider)
 */
export interface ProviderScorecard {
    /** calculated from providerId, scorecardId, and scorecard start and end date */
    id: string;
    providerId: string;
    scorecardId: string;
    title: string;
    description: string;
    scorecardStartDate: Date;
    scorecardEndDate: Date;
  }
  /** Represents one provider scorecard search result with a unique ID
   * usable by Provider Selection UI */
  export class ProviderScorecardSearchResult {
    /** should be equal to item.id */
    id: string;
    index: number;
    isSelected: boolean;
    item: ProviderScorecard;
  }

  export interface ProviderScorecardState extends EntityState<ProviderScorecard> {}
