import { Graph } from 'src/app/_services/graph/Graph';
import { IStrategy } from '../../istrategy';

/**
 * This is a cop strategy.
 * In this strategy, when moving the cop tries to go on a vertex that watch the maximum of vertex accessible by the thief. 
 * If all vertexes accessible by the cop, don't watch any vertex accessible by the thief, the cop will choose a vertex that reduce 
 * his distance to thief thief. 
 */
export class WatchingStrategy implements IStrategy {
    actual_place: any;
    stay_on_spot = 0;

    placement(graph: Graph, cops_position_slot: any[], thiefs_position_slot: any[]) {
        this.actual_place = graph.getRandomEdge();
        return this.actual_place;
    }

    move(graph: Graph, cops_position_slot: any[], thiefs_position_slot: any[]) {
        const edges = graph.edges(this.actual_place);
        let vertex;

        let closest_vertex;
        
        //Calculer le nombre de sommet maximal qui peuvent être gardé par le policier
        let watchVertex = [];
        let thief_possible_move = [];
        for(const p of thiefs_position_slot) {
            graph.edges(p).forEach(v => {
                thief_possible_move.push(v)
            })
        }
        let distance = graph.nodes.length;
        console.log('STAY ON SPOT', this.stay_on_spot)
        for(const e of edges) {
            // Compte les sommets surveillé par les policiers
            const temp = graph.edges(e).filter(v => thief_possible_move.includes(v));
            if(temp.length > watchVertex.length) {
                watchVertex = temp
                vertex = e;
            }
            else if(temp.length === watchVertex.length) {
                // TODO : cops move if two cops are on the same spot
                let count_on_spot = 0;
                for(const c of cops_position_slot) {
                    count_on_spot += c.index===this.actual_place.index? 1:0;
                }
                if(count_on_spot > 1) {
                    watchVertex = temp;
                    vertex = e;
                }
            }

            // Réduire la distance avec le voleur
            let globalDist = 0;
            for(const t of thiefs_position_slot) {
                const d = graph.distance(e, t);
                globalDist += d !== -1 ? d : 0;
            }

            if(!closest_vertex || globalDist <= distance) {
                closest_vertex = e;
                distance = globalDist;
            }
        }

        if(watchVertex.length === 0) {
            vertex = closest_vertex
        }

        this.actual_place = vertex;
        return this.actual_place;
    }
}
