import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { NgModule, Optional, SkipSelf } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { MetaReducer, StoreModule } from '@ngrx/store';
import { storeFreeze } from 'ngrx-store-freeze';

import { environment } from '@env/environment';

import { AuthService } from '@app/core/auth/auth.service';
import { TokenInterceptor } from '@app/core/auth/token.interceptor';
import { AuthGuardService } from './auth/auth-guard.service';
import { AuthEffects } from './auth/auth.effects';
import { authReducer } from './auth/auth.reducer';
import { LocalStorageService } from './local-storage/local-storage.service';
import { debug } from './meta-reducers/debug.reducer';
import { initStateFromLocalStorage } from './meta-reducers/init-state-from-local-storage.reducer';

export const metaReducers: Array<MetaReducer<any>> = [initStateFromLocalStorage];

if (!environment.production) {
  metaReducers.unshift(debug, storeFreeze);
}

@NgModule({
  imports: [
    // angular
    CommonModule,
    HttpClientModule,

    // ngrx
    StoreModule.forRoot(
      {
        auth: authReducer
      },
      { metaReducers }
    ),
    EffectsModule.forRoot([AuthEffects])
  ],
  declarations: [],
  providers: [LocalStorageService, AuthGuardService,
    AuthService, {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    }],
})
export class CoreModule {
  constructor(
    @Optional()
    @SkipSelf()
    parentModule: CoreModule
  ) {
    if (parentModule) {
      throw new Error('CoreModule is already loaded. Import only in AppModule');
    }
  }
}
