import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReportCardsRoutingModule } from '@app/report-cards/report-cards-routing.module';
import { ReportCardComponent } from './report-card/report-card.component';

@NgModule({
  imports: [
    CommonModule,
    ReportCardsRoutingModule
  ],
  declarations: [ReportCardComponent]
})
export class ReportCardsModule { }
