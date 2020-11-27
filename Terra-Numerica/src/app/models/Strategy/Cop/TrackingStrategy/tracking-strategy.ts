import { Graph } from 'src/app/_services/graph/Graph';
import { IStrategy } from '../../istrategy';

/**
 * This is a cop strategy. It will minimise the global distance with all thief.
 */
export class TrackingStrategy implements IStrategy {
    actual_place: any;

    placement(graph: Graph, cops_position_slot: any[], thiefs_position_slot: any[]) {
        this.actual_place = graph.getRandomEdge();
        return this.actual_place;
    }

    move(graph: Graph, cops_position_slot: any[], thiefs_position_slot: any[]) {
        let closest;
        let distance = graph.nodes.length;
        const edges = graph.edges(this.actual_place);
        console.warn('START FOR LOOP')
        for(const e of edges) {
            let globalDist = 0;
            for(const t of thiefs_position_slot) {
                console.log('E', e);
                console.log('T', t);
                const d = graph.distance(e, t);
                console.log('D', d)
                globalDist += d !== -1 ? d : 0;
            }

            if(!closest || globalDist <= distance) {
                closest = e;
                distance = globalDist;
            }
            console.log('GLOBAL DISTANCE', globalDist)
        }
        this.actual_place = closest;
        console.warn('DISPLAY VALUE')
        console.log('HERE', this.actual_place);
        console.log('DIST', distance)
        return this.actual_place;
    }
}
