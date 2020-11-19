import * as d3 from 'd3';
import { PawnState } from '../pawn-state';

export class PawnStateWaitingTurn implements PawnState {
    dragstarted(event: any, d: any) {
        throw new Error('Method not implemented.');
    }
    dragged(event: any, d: any) {
        d3.select(this as any).attr("cx", event.x).attr("cy", event.y);
    }
    dragended(event: any, d: any): PawnState {
        throw new Error('Method not implemented.');
    }
}
