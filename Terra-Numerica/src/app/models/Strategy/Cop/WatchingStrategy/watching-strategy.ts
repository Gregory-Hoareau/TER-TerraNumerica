import { Graph } from 'src/app/models/Graph/graph';
import { Grid } from 'src/app/models/Graph/Grid/grid';
import { Pawns } from 'src/app/models/Pawn/pawn';
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
        let nextTo = true;
        while(nextTo) { 
            this.actual_place = graph.getRandomEdge();
            nextTo = false;
            for(const c of cops_position_slot) {
                if(graph.distance(this.actual_place, c) <= 1) {
                    nextTo = true;
                    break;
                }
            }
        }
        return this.actual_place;
    }

    move(graph: Graph, cops_position_slot: any[], thiefs_position_slot: any[], speed, cop: Pawns) {
        const edges = graph.edges(this.actual_place);
        edges.push(this.actual_place);

        const width = (graph as Grid).width;
        const height = (graph as Grid).height;

        const thief_pos = thiefs_position_slot[0];
        let thief_line = this.getLine(thief_pos.index, width);
        let thief_col = this.getColumn(thief_pos.index, width);

        let cop_line = this.getLine(this.actual_place.index, width);
        let cop_col = this.getColumn(this.actual_place.index, width);

        let vertex_index;
        if(cop.role.includes('0')) {
            if (cop_col === thief_col) {
                if (cop_line > thief_line) { vertex_index = this.moveUp(cop_line, cop_col, width, height); }
                else { vertex_index = this.moveDown(cop_line, cop_col, width, height); }
            } else if (cop_col > thief_col) {
                vertex_index = this.moveRight(cop_line, cop_col, width, height);
            } else {
                vertex_index = this.moveLeft(cop_line, cop_col, width, height);
            }
        } else {
            if (cop_line === thief_line) {
                if (cop_col > thief_col) { vertex_index = this.moveRight(cop_line, cop_col, width, height); }
                else { vertex_index = this.moveLeft(cop_line, cop_col, width, height); }
            } else if (cop_line > thief_line) {
                vertex_index = this.moveUp(cop_line, cop_col, width, height);
            } else {
                vertex_index = this.moveDown(cop_line, cop_col, width, height);
            }
        }

        const v = edges.find(e => e.index === vertex_index);
        this.actual_place = v;
        return this.actual_place;
    }

    private moveRight(line, col, width, height) {
        const l = line;
        const c = (col - 1 >= 0) ? col - 1 : col;
        
        return (l * width) + c
    }

    private moveLeft(line, col, width, height) {
        const l = line;
        const c = (col + 1 < width) ? col + 1 : col;
        
        return (l * width) + c
    }

    private moveUp(line, col, width, height) {
        const l = (line - 1 >= 0)? line - 1 : line;
        const c = col;
        
        return (l * width) + c
    }

    private moveDown(line, col, width, height) {
        const l = (line + 1 < height) ? line + 1 : line;
        const c = col;
        
        return (l * width) + c
    }

    private getLine(node_index, width) {
        return Math.floor(node_index/width);
    }

    private getColumn(node_index, width) {
        return node_index % width;
    }
}
