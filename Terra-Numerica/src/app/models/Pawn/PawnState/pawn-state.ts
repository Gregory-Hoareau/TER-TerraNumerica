export interface PawnState {
    dragstarted(event, d);
    dragged(event, d);
    dragended(event, d): PawnState;
}
