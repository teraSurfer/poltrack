import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuardService } from '@app/core';

import { AuthenticatedComponent } from './authenticated/authenticated.component';
import { ExamplesComponent } from './examples/examples.component';
import { StockMarketComponent } from './stock-market/stock-market.component';
import { ParentComponent } from './theming/parent/parent.component';
import { TodosComponent } from './todos/todos.component';

const routes: Routes = [
  {
    path: '',
    component: ExamplesComponent,
    children: [
      {
        path: '',
        redirectTo: 'todos',
        pathMatch: 'full'
      },
      {
        path: 'todos',
        component: TodosComponent,
        data: {
          title: 'Todos'
        }
      },
      {
        path: 'stock-market',
        component: StockMarketComponent,
        data: {
          title: 'Stock Market'
        }
      },
      {
        path: 'theming',
        component: ParentComponent,
        data: {
          title: 'Theming'
        }
      },
      {
        path: 'authenticated',
        component: AuthenticatedComponent,
        canActivate: [AuthGuardService],
        data: {
          title: 'Authenticated'
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExamplesRoutingModule {}
