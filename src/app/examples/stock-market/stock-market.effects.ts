import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  map,
  switchMap,
  tap
} from 'rxjs/operators';

import { LocalStorageService } from '@app/core';

import {
  ActionStockMarketRetrieve,
  ActionStockMarketRetrieveError,
  ActionStockMarketRetrieveSuccess,
  STOCK_MARKET_KEY,
  StockMarketActionTypes
} from './stock-market.reducer';
import { StockMarketService } from './stock-market.service';

@Injectable()
export class StockMarketEffects {
  constructor(
    private actions$: Actions<Action>,
    private localStorageService: LocalStorageService,
    private service: StockMarketService
  ) {}

  @Effect()
  retrieveStock(): Observable<Action> {
    return this.actions$.ofType(StockMarketActionTypes.RETRIEVE).pipe(
      tap((action: ActionStockMarketRetrieve) =>
        this.localStorageService.setItem(STOCK_MARKET_KEY, {
          symbol: action.payload.symbol
        })
      ),
      distinctUntilChanged(),
      debounceTime(500),
      switchMap((action: ActionStockMarketRetrieve) =>
        this.service
          .retrieveStock(action.payload.symbol)
          .pipe(
            map(stock => new ActionStockMarketRetrieveSuccess({ stock })),
            catchError(error =>
              of(new ActionStockMarketRetrieveError({ error }))
            )
          )
      )
    );
  }
}
