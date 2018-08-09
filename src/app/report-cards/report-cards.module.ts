import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '@app/shared';

import { ReportCardsUxComponent } from '@app/report-cards/report-card-ux/report-cards-ux.component';
import { ReportCardsContainerComponent } from '@app/report-cards/report-cards-container/report-cards-container.component';
import { ReportCardsRoutingModule } from '@app/report-cards/report-cards-routing.module';

@NgModule({
  imports: [CommonModule, SharedModule, ReportCardsRoutingModule],
  declarations: [ReportCardsUxComponent, ReportCardsContainerComponent]
})
export class ReportCardsModule {}
