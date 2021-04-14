import { Graph } from 'src/app/models/Graph/graph';
import { IStrategy } from '../../istrategy';

/**
 * This is a thief strategy. It will maximise the global distance with all cops.
 */
export class RunawayStrategy implements IStrategy {
    actual_place: any;

    placement(graph: Graph, cops_position_slot: any[], thiefs_position_slot: any[]) {
        this.actual_place = graph.getRandomEdge();
        let max_dist = -1;
        let distant_edges = [];
        let toCheck = [];
        toCheck.push(this.actual_place)
        const marked = [];
        while (!toCheck.every((edge) => marked.includes(edge))) {
            const tmp = toCheck;
            toCheck = []
            for(const edge of tmp) {
                let distance = 0;
                for(const position of cops_position_slot) {
                    distance += graph.distance(edge, position)
                }
                if(distance > max_dist) {
                    max_dist = distance;
                    distant_edges = [edge]
                } else if(distance === max_dist) {
                    distant_edges.push(edge)
                }
                marked.push(edge)
                graph.edges(edge).forEach(e => {
                    toCheck.push(e);
                })
            }
        }
        const res = distant_edges[Math.floor(Math.random() * Math.floor(distant_edges.length))]
        return res;
    }

    move(graph: Graph, cops_position_slot: any[], thiefs_position_slot: any[], speed) {
        let farthest;
        let dist = 0;
        const edges = graph.edges(this.actual_place, speed, cops_position_slot).filter(e => !cops_position_slot.includes(e));
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
