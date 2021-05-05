import { Graph } from "src/app/models/Graph/graph";
import { IStrategy } from "../../istrategy";

export class RandomCopsStrategy implements IStrategy {
    actual_place = null;

    placement(graph: Graph, cops_position_slot: any[], thiefs_position_slot: any[]) {
        this.actual_place = graph.getRandomEdge();
        return this.actual_place;
    }

    move(graph: Graph, cops_position_slot: any[], thiefs_position_slot: any[], speed = 1) {
        /* this.actual_place = graph.getRandomAccessibleEdges(this.actual_place, speed); */
        let vertex = null;
        const edges = graph.edges(this.actual_place).forEach(n => {
            for(const p of thiefs_position_slot) {
                if(graph.distance(n, p) < 1) {
                    vertex = n
                }
            }
        })
        if(vertex === null) vertex = graph.getRandomAccessibleEdges(this.actual_place, speed);

        this.actual_place = vertex;
        return this.actual_place;
    }
}
