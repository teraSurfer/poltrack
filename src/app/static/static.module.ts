import { NgModule } from '@angular/core';

import { SharedModule } from '@app/shared';

import { AboutComponent } from './about/about.component';
import { FeaturesComponent } from './features/features.component';
import { StaticRoutingModule } from './static-routing.module';

@NgModule({
  imports: [SharedModule, StaticRoutingModule],
  declarations: [AboutComponent, FeaturesComponent]
})
export class StaticModule {}
