import { PawnStateOnTurn } from "src/app/models/Pawn/PawnState/PawnStateOnTurn/pawn-state-on-turn";
import { PawnStateWaitingPlacement } from "src/app/models/Pawn/PawnState/PawnStateWaitingPlacement/pawn-state-waiting-placement";
import { PawnStateWaitingTurn } from "src/app/models/Pawn/PawnState/PawnStateWaitingTurn/pawn-state-waiting-turn";

export const environment = {
  production: true,
  waitingPlacementState: new PawnStateWaitingPlacement(),
  onTurnState: new PawnStateOnTurn(),
  waitingTurnState: new PawnStateWaitingTurn()
};
