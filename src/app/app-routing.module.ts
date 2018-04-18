import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SettingsComponent } from './settings';

const routes: Routes = [
  {
    path: 'settings',
    component: SettingsComponent,
    data: {
      title: 'Settings'
    }
  },
  {
    path: 'tools',
    loadChildren: 'app/examples/examples.module#ExamplesModule'
  },
  { path: '', redirectTo: '/reportcard', pathMatch: 'full' },
  { path: '**', redirectTo: '/reportcard' }
];

@NgModule({
  // useHash supports github.io demo page, remove in your app
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule {}
