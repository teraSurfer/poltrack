// import {
//   ReportCardsActions,
//   ReportCardsActionTypes
// } from './report-cards.actions';
// import { ReportCardsState } from '@app/report-cards/report-cards.model';
// import { getHash } from '@app/shared';

// export const initialState: ReportCardsState = {
//   selectedActors: new Array<ActorSearchResult>()
// };

// /** returns copy of currentActors with actorToRemove removed */
// function removeActor(
//   currentActors: Array<ActorSearchResult>,
//   actorToRemove: ActorSearchResult
// ): Array<ActorSearchResult> {
//   const newActors = new Array<ActorSearchResult>();
//   const idToRemove = getActorId(actorToRemove);

//   currentActors.forEach(element => {
//     if (getActorId(element) !== idToRemove) {
//       // push a copy of the element to the new array
//       newActors.push(Object.assign({}, element));
//     }
//   });

//   return newActors;
// }

// /** returns copy of currentActors that also includes a copy of actorToAdd */
// function addActor(
//   currentActors: Array<ActorSearchResult>,
//   actorToAdd: ActorSearchResult
// ): Array<ActorSearchResult> {
//   const newActors = new Array<ActorSearchResult>();

//   currentActors.forEach(element => {
//     // push a copy of the element to the new array
//     newActors.push(Object.assign({}, element));
//   });

//   newActors.push(Object.assign({}, actorToAdd));

//   return newActors;
// }

// function getActorId(actor: ActorSearchResult): number {
//   return getHash(actor.actorId + actor.officeId);
// }

// export function reportCardsReducer(
//   state: ReportCardsState = initialState,
//   action: ReportCardsActions
// ): ReportCardsState {
//   switch (action.type) {
//     case ReportCardsActionTypes.ACTOR_SELECTED:
//       return {
//         ...state,
//         selectedActors: addActor(state.selectedActors, action.payload.actor)
//       };
//     case ReportCardsActionTypes.ACTOR_UNSELECTED:
//       return {
//         ...state,
//         selectedActors: removeActor(state.selectedActors, action.payload.actor)
//       };
//     default:
//       return state;
//   }
// }
