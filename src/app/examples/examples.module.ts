import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { SharedModule } from '@app/shared';

import { AuthenticatedComponent } from './authenticated/authenticated.component';
import { ExamplesRoutingModule } from './examples-routing.module';
import { ExamplesComponent } from './examples/examples.component';
import { StockMarketComponent } from './stock-market/stock-market.component';
import { StockMarketEffects } from './stock-market/stock-market.effects';
import { stockMarketReducer } from './stock-market/stock-market.reducer';
import { StockMarketService } from './stock-market/stock-market.service';
import { ChildComponent } from './theming/child/child.component';
import { ParentComponent } from './theming/parent/parent.component';
import { TodosComponent } from './todos/todos.component';
import { TodosEffects } from './todos/todos.effects';
import { todosReducer } from './todos/todos.reducer';

@NgModule({
  imports: [
    SharedModule,
    ExamplesRoutingModule,
    StoreModule.forFeature('examples', {
      todos: todosReducer,
      stocks: stockMarketReducer
    }),
    EffectsModule.forFeature([TodosEffects, StockMarketEffects])
  ],
  declarations: [
    ExamplesComponent,
    TodosComponent,
    StockMarketComponent,
    ParentComponent,
    ChildComponent,
    AuthenticatedComponent
  ],
  providers: [StockMarketService]
})
export class ExamplesModule {
  constructor() {}
}
