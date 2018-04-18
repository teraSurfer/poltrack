import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ReportCardComponent } from '@app/report-cards/report-card/report-card.component';

const routes: Routes = [
  {
    path: 'reportcard',
    component: ReportCardComponent,
    data: { title: 'Report Card' }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportCardsRoutingModule {}
