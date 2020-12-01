import { Graph } from 'src/app/_services/graph/Graph';
import { IStrategy } from '../../istrategy';
import { GraphService } from 'src/app/_services/graph/graph.service';

/**
 * This is a cop strategy. It will minimise the global distance with all thief.
 */
export class GridStrategy implements IStrategy {
    actual_place: any;   

    constructor(private graphService: GraphService){}

    placement(graph: Graph, cops_position_slot: any[], thiefs_position_slot: any[]) {
        let g = this.graphService.getGrid();
        let nodes = this.graphService.getNodes();

        if(cops_position_slot.length === 0){
            this.actual_place = nodes[(g.long * g.lar) - g.lar]

        }else{
            let last_pos = cops_position_slot[cops_position_slot.length - 1];
            this.actual_place = nodes[last_pos.index + 1]

        }
        if(this.actual_place === undefined){
            this.actual_place = nodes[(g.long * g.lar) - g.lar]

        }
        return this.actual_place;
    }

    move(graph: Graph, cops_position_slot: any[], thiefs_position_slot: any[]) {
        let closest;
        let distance = graph.nodes.length;
        const edges = graph.edges(this.actual_place);
        for(const e of edges) {
            let globalDist = 0;
            for(const t of thiefs_position_slot) {
                const d = graph.distance(e, t);
                globalDist += d !== -1 ? d : 0;
            }

            if(!closest || globalDist <= distance) {
                closest = e;
                distance = globalDist;
            }

        }
        this.actual_place = closest;
        return this.actual_place;
    }

}
