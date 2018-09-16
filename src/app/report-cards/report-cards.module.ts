import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '@app/shared';

import { ReportCardsComponent } from '@app/report-cards/components/report-cards.component';
import { ReportCardsContainerComponent } from '@app/report-cards/components/report-cards-container.component';
import { ReportCardsRoutingModule } from '@app/report-cards/report-cards-routing.module';
// import { EffectsModule } from '@ngrx/effects';
// import { ReportCardsEffects } from '@app/report-cards/report-cards.effects';
import { ReportCardsService } from './report-cards.service';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    ReportCardsRoutingModule
    // EffectsModule.forFeature([ReportCardsEffects])
  ],
  declarations: [ReportCardsComponent, ReportCardsContainerComponent],
  providers: [ReportCardsService]
})
export class ReportCardsModule {}
