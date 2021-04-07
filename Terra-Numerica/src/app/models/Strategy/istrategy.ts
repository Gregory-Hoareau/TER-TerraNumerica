import { Graph } from '../Graph/graph';

export interface IStrategy {
    
    actual_place: any; //Same type as the edges

    //Return an edge from the graph pass in arguments
    placement(graph: Graph, cops_position_slot: any[], thiefs_position_slot: any[]): any;
    
    //Return an edge from the graph pass in arguments 
    move(graph: Graph, cops_position_slot: any[], thiefs_position_slot: any[], speed: number): any;
}
