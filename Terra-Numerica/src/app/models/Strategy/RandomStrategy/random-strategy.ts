import { Graph } from '../../Graph/graph';
import { IStrategy } from '../istrategy';

export class RandomStrategy implements IStrategy {
    actual_place = null;

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

    move(graph: Graph, cops_position_slot: any[], thiefs_position_slot: any[], speed = 1) {
        this.actual_place = graph.getRandomAccessibleEdges(this.actual_place, speed);
        return this.actual_place;
    }
}
