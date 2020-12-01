import { Graph } from 'src/app/_services/graph/Graph';
import { IStrategy } from '../../istrategy';
import { GraphService } from 'src/app/_services/graph/graph.service';
import { tickStep } from 'd3';

/**
 * This is a cop strategy. It will minimise the global distance with all thief.
 */
export class OneCopsWinStrategy implements IStrategy {
    actual_place: any;   
    thiefFound: boolean = false
    tempo: boolean = false
    lastThiefPos: any;

    constructor(){}

    placement(graph: Graph, cops_position_slot: any[], thiefs_position_slot: any[]) {
        this.actual_place = graph.getRandomEdge();
        return this.actual_place;
    }

    move(graph: Graph, cops_position_slot: any[], thiefs_position_slot: any[]) {
        let closest;
        let distance = graph.nodes.length;
        const edges = graph.edges(this.actual_place);
        if(!this.thiefFound){
            for(const e of edges) {
                let globalDist = 0;
                for(const t of thiefs_position_slot) {
                    const d = graph.distance(e, t);
                    globalDist += d !== -1 ? d : 0;
                    let thiefEdges = graph.edges(thiefs_position_slot[thiefs_position_slot.length - 1])
                    thiefEdges.forEach(thiefedge => {
                        if(e===thiefedge){
                            this.tempo = true;
                        }
                    })
                    
                }

                if((!closest || globalDist <= distance) && !this.thiefFound){
                    closest = e;
                    distance = globalDist;
                    console.log(this.tempo)
                    if(this.tempo){
                        this.thiefFound = true
                        this.lastThiefPos = thiefs_position_slot[0]
                    }
                }

            }
        }else if(this.thiefFound){
            closest = this.lastThiefPos;
            this.lastThiefPos = thiefs_position_slot[0]
        }
        console.log(thiefs_position_slot)
        this.actual_place = closest;
        return this.actual_place;
    }

}
