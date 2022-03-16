import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {fetchAStarAxios} from "./astarAPI"
import {RootState} from "../../app/store";
import {BoardStatus} from "../board/boardSlice";
import {fetchDijkstraAxios} from "./dijkstraAPI";




export const enum PathfindingAlgorithm {
    DIJKSTRA,
    A_STAR
}

export interface PathfindingPromise {
    distance: number
    distanceMap: Map<string, number>
    end: number[]
    start: number[]
    path: Map<string, null>
}


export interface PathfindingStatus {
    distance: number
    found: number[][],
    path: Map<string, null>,
    visited: Map<string, number>
    status: "active" | 'idle' | 'pending' | 'failed';
}




const initialState: PathfindingStatus = {
    distance: 0,
    found: [],
    path: new Map(),
    visited: new Map(),
    status: "idle"
}


export const startPathfindingAsync = createAsyncThunk(
    "patfinding/fetchPathfinding",
    async (data: { boardStatus: BoardStatus,
                                algorithm: PathfindingAlgorithm}) => {

        switch(data.algorithm) {
            case PathfindingAlgorithm.DIJKSTRA:
                return fetchDijkstraAxios(data.boardStatus)
            case PathfindingAlgorithm.A_STAR:
                return fetchAStarAxios(data.boardStatus)

            default:
                console.log("NOT IMPLEMENTED YET")
        }

    }
)


export const pathfindingSlice = createSlice({
    name: "pathfinding",
    initialState,
    reducers: {
        clear: (state) => {
            state.found = []
            state.path = new Map()
            state.distance = 0
            state.visited = new Map()
            state.status = "idle"
        }
    },

    extraReducers: (builder) => {
        builder.addCase(startPathfindingAsync.fulfilled, (state, action) => {
            state.distance = action.payload!.distance
            //is required because of serializing
            state.path = new Map(Object.entries(action.payload!.path))
            state.visited = new Map(Object.entries(action.payload!.distanceMap))
            state.status = "active"

        })

    }
})


export const { clear } = pathfindingSlice.actions;

export const selectDistance = (state: RootState) => state.pathfinding.distance
export const selectPath = (state: RootState) => state.pathfinding.path
export const selectVisited = (state: RootState) => state.pathfinding.visited
export const selectStatus = (state: RootState) => state.pathfinding.status

export default pathfindingSlice.reducer;