import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReportCardsRoutingModule } from '@app/report-cards/report-cards-routing.module';
import { ReportCardComponent } from './report-card/report-card.component';

import { SharedModule } from '@app/shared';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    ReportCardsRoutingModule
  ],
  declarations: [ReportCardComponent]
})
export class ReportCardsModule { }
