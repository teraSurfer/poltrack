// import { Injectable } from '@angular/core';
// import { Action } from '@ngrx/store';
// import { Actions, Effect, ofType } from '@ngrx/effects';
// import { of } from 'rxjs';
// import {
//   tap,
//   map,
//   debounceTime,
//   distinctUntilChanged,
//   switchMap,
//   catchError
// } from 'rxjs/operators';

// import {
//   ActionReportCardsActorSearch,
//   ActionReportCardsActorSearchError,
//   ActionReportCardsActorSearchSuccess,
//   ReportCardsActionTypes
// } from '@app/report-cards/report-cards.actions';

// import { ReportCardsService } from './report-cards.service';

// @Injectable()
// export class ReportCardsEffects {
//   constructor(
//     private actions$: Actions<Action>,
//     private reportCardsService: ReportCardsService
//   ) {}

//   @Effect()
//   actorSearch() {
//     return this.actions$.pipe(
//       ofType<ActionReportCardsActorSearch>(ReportCardsActionTypes.ACTOR_SEARCH),
//       distinctUntilChanged(),
//       debounceTime(700),
//       switchMap((action: ActionReportCardsActorSearch) =>
//         this.reportCardsService
//           .searchActors(action.payload.searchString)
//           .pipe(
//             map(
//               searchResultArray =>
//                 new ActionReportCardsActorSearchSuccess({ searchResultArray })
//             ),
//             catchError(error =>
//               of(new ActionReportCardsActorSearchError({ error }))
//             )
//           )
//       )
//     );
//   }
// }
