import { Graph } from '../../Graph/graph';
import { IStrategy } from '../istrategy';

export class RandomStrategy implements IStrategy {
    actual_place = null;

    placement(graph: Graph, cops_position_slot: any[], thiefs_position_slot: any[]) {
        this.actual_place = graph.getRandomEdge();
        return this.actual_place;
    }

    move(graph: Graph, cops_position_slot: any[], thiefs_position_slot: any[]) {
        this.actual_place = graph.getRandomAccessibleEdges(this.actual_place);
        return this.actual_place;
    }
}
