import { IStrategy } from '../../istrategy';
import { GraphService } from 'src/app/_services/graph/graph.service';
import { Graph } from 'src/app/models/Graph/graph';
import { getInterpolationArgsLength } from '@angular/compiler/src/render3/view/util';
import { Grid } from 'src/app/models/Graph/Grid/grid';
import { GameService } from 'src/app/_services/game/game.service';

/**
 * This is a cop strategy. This strategy will be chosen if they're more than 2 cops on a grid type graph.
 * Cops following this strategy will all be placed one above the other on the last collumn of the grid and
 * then they'll start to move to the left in order to find the thief. If the thief decide to try to pass below
 * the cops column then all the column will go down to keep chasing the thief (this way it also work on torique grid)
 * will be improved => one cops can be placed every 3 node before another cops is placed, it makes enough cops to 
 * prevent the thief to try to go trough the cops column  
 */
export class GridStrategy implements IStrategy {
    actual_place: any; 

    constructor(private graphService: GraphService, private gameService: GameService){}

    placement(graph: Graph, cops_position_slot: any[], thiefs_position_slot: any[]) {
        let nodes = this.graphService.getNodes();
        let grid;
        if (graph.typology === "grid"){
            grid = graph as Grid;
        }
        let first_pos
        let next_pos
        if(this.gameService.getCopsNumber() === grid.long){
            first_pos = 0;
            next_pos = grid.lar;
        }else if(this.gameService.getCopsNumber() >= grid.lar - 1){
            first_pos = (grid.long * grid.lar) - grid.lar;
            next_pos = 1;
        }else{
            first_pos = (grid.long * grid.lar) - grid.lar;
            next_pos = 3;
        }

        if(cops_position_slot.length === 0){
            this.actual_place = nodes[first_pos];

        }else{
            let last_pos = cops_position_slot[cops_position_slot.length - 1];
            this.actual_place = nodes[last_pos.index + next_pos]

        }
        if(this.actual_place === undefined){
            this.actual_place = nodes[first_pos]

        }
        return this.actual_place;
    }

    move(graph: Graph, cops_position_slot: any[], thiefs_position_slot: any[]) {
        let nodes = this.graphService.getNodes();
        let closest;
        let grid;
        if (graph.typology === "grid"){
            grid = graph as Grid;
        }
        let distance = graph.nodes.length;
        let edges = graph.edges(this.actual_place);
        edges.push(this.actual_place);
        edges = edges.filter(e => !(cops_position_slot.includes(e)))
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
