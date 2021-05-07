import { Graph } from 'src/app/models/Graph/graph';
import { IStrategy } from '../../istrategy';

/**
 * This is a thief strategy. It will maximise the global distance with all cops.
 */
export class RunawayStrategy implements IStrategy {
    actual_place: any;

    placement(graph: Graph, cops_position_slot: any[], thiefs_position_slot: any[]) {
        this.actual_place = graph.getRandomEdge();
        let marked = []
        while(cops_position_slot.some(c => graph.distance(this.actual_place, c) <= 1)) {
            marked.push(this.actual_place);
            if(marked.length >= graph.nodes.length) break;
            while(marked.includes(this.actual_place)) {
                this.actual_place = graph.getRandomEdge();
            }
        }
        return this.actual_place;
    }

    move(graph: Graph, cops_position_slot: any[], thiefs_position_slot: any[], speed) {
        let farthest;
        let dist = 0;
        const edges = graph.edges(this.actual_place, speed, cops_position_slot).filter(e => !cops_position_slot.includes(e));
        edges.push(this.actual_place);
        for(const e of edges) {
            let globalDist = 0;
            let tooClose = false;
            for(const c of cops_position_slot) {
                const d = graph.distance(e, c);
                globalDist += d;
                if (d <= 1) {
                    tooClose = true;
                }
            }

            if(!tooClose && (!farthest || globalDist > dist)) {
                farthest = e;
                dist = globalDist;
            }
        }
        
        if(farthest) {
            this.actual_place = farthest;
        }
        return this.actual_place;
    }
}
