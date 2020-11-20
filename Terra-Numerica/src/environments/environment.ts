// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

import { PawnStateOnTurn } from 'src/app/models/Pawn/PawnState/PawnStateOnTurn/pawn-state-on-turn';
import { PawnStateWaitingPlacement } from 'src/app/models/Pawn/PawnState/PawnStateWaitingPlacement/pawn-state-waiting-placement';
import { PawnStateWaitingTurn } from 'src/app/models/Pawn/PawnState/PawnStateWaitingTurn/pawn-state-waiting-turn';

export const environment = {
  production: false,
  waitingPlacementState: new PawnStateWaitingPlacement(),
  onTurnState: new PawnStateOnTurn(),
  waitingTurnState: new PawnStateWaitingTurn()
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
