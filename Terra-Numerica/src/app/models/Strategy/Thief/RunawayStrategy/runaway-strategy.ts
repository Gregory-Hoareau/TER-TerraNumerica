import { Graph } from 'src/app/models/Graph/graph';
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
        edges.push(this.actual_place);
        for(const e of edges) {
            let globalDist = 0;
            for(const c of cops_position_slot) {
                const d = graph.distance(e, c);
                globalDist += d !== -1 ? d : 0;
            }

            if(!farthest || globalDist > dist) {
                farthest = e;
                dist = globalDist;
            }
        }
        this.actual_place = farthest;
        return this.actual_place;
    }
}
