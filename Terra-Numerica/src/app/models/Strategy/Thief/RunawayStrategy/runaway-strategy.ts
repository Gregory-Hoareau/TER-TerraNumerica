import { Graph } from 'src/app/_services/graph/Graph';
import { IStrategy } from '../../istrategy';

/**
 * This is a thief strategy. It will maximise the global distance with all cops.
 */
export class RunawayStrategy implements IStrategy {
    actual_place: any;

    placement(graph: Graph, cops_position_slot: any[], thiefs_position_slot: any[]) {
        this.actual_place = graph.getRandomEdge();
        return this.actual_place;
    }

    move(graph: Graph, cops_position_slot: any[], thiefs_position_slot: any[]) {
        let farthest;
        let dist = 0;
        const edges = graph.edges(this.actual_place);
        let i = 1
        for(const e of edges) {
            console.log(i++)
            if(!farthest) {
                farthest = e;
                for(const c of cops_position_slot) {
                    dist += graph.distance(e, c);
                } 
            } 
            else {
                let globalDist = 0;
                for(const c of cops_position_slot) {
                    globalDist += graph.distance(e, c);
                }
                if(globalDist > dist) {
                    farthest = e;
                    dist = globalDist;
                }
            }
        }
        this.actual_place = farthest;
        return this.actual_place;
    }
}
