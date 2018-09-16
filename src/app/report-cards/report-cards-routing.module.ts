import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ReportCardsContainerComponent } from '@app/report-cards/components/report-cards-container.component';

const routes: Routes = [
  {
    path: 'reportcard',
    component: ReportCardsContainerComponent,
    data: { title: 'Report Card' }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportCardsRoutingModule {}
