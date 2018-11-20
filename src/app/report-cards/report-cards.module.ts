import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '@app/shared';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { ReportCardsComponent } from '@app/report-cards/components/report-cards.component';
import { ReportCardsContainerComponent } from '@app/report-cards/components/report-cards-container.component';
import { ReportCardsRoutingModule } from '@app/report-cards/report-cards-routing.module';
// import { ReportCardsEffects } from '@app/report-cards/report-cards.effects';
import { ReportCardsService } from './report-cards.service';
import { ActorsEffects } from './actors.effects';
import { FEATURE_NAME, reducers } from './report-cards.state';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    ReportCardsRoutingModule,
    StoreModule.forFeature(FEATURE_NAME, reducers),
    EffectsModule.forFeature([ActorsEffects])
  ],
  declarations: [ReportCardsComponent, ReportCardsContainerComponent],
  providers: [ReportCardsService]
})
export class ReportCardsModule {}
