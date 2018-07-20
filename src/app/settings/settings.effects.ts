import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { AnimationsService, LocalStorageService } from '@app/core';

import {
  ActionSettingsPersist,
  SETTINGS_KEY,
  SettingsActionTypes
} from './settings.reducer';

@Injectable()
export class SettingsEffects {
  constructor(
    private actions$: Actions<Action>,
    private localStorageService: LocalStorageService,
    private animationsService: AnimationsService
  ) {}

  @Effect({ dispatch: false })
  persistSettings(): Observable<Action> {
    return this.actions$.ofType(SettingsActionTypes.PERSIST).pipe(
      tap((action: ActionSettingsPersist) => {
        const { settings } = action.payload;
        const { pageAnimations, elementsAnimations } = settings;
        this.localStorageService.setItem(SETTINGS_KEY, settings);
        this.animationsService.updateRouteAnimationType(
          pageAnimations,
          elementsAnimations
        );
      })
      );
  }
}
