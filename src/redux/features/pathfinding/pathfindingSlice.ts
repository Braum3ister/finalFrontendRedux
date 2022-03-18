import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {fetchAStarAxios} from "./astarAPI"
import {RootState} from "../../app/store";
import {BoardStatus} from "../board/boardSlice";
import {fetchDijkstraAxios} from "./dijkstraAPI";
import {fetchBiDijkstraAxios} from "./bidirectional_pathfinding/biDijkstraAPI";


export const enum PathfindingAlgorithm {
    DIJKSTRA,
    A_STAR,

}

export const enum BiPathfindingAlgorithm {
    BI_DIJKSTRA,
    BI_A_STAR
}

export interface PathfindingPromise {
    distance: number
    distanceMap: {}
    path: {}

}

export interface BiPathfindingPromise {
    distance: number
    forwardDistanceMap: Map<string, number>
    backwardDistanceMap: Map<string, number>
    end: number[]
    start: number[]
    path: Map<string, null>
}


export interface PathfindingStatus {
    distance: number
    found: number[][],
    path: Map<string, null>,
    forwardDistanceMap: Map<string, number>
    backwardDistanceMap: Map<string, number>
    status: "active" | 'idle' | 'pending' | 'failed';
}


const initialState: PathfindingStatus = {
    distance: 0,
    found: [],
    path: new Map(),
    forwardDistanceMap: new Map(),
    backwardDistanceMap: new Map(),
    status: "idle"
}


export const startPathfindingAsync = createAsyncThunk(
    "patfinding/fetchPathfinding",
    async (data: {
        boardStatus: BoardStatus,
        algorithm: PathfindingAlgorithm
    }) => {

        switch (data.algorithm) {
            case PathfindingAlgorithm.DIJKSTRA:
                return fetchDijkstraAxios(data.boardStatus)
            case PathfindingAlgorithm.A_STAR:
                return fetchAStarAxios(data.boardStatus)
            default:
                console.log("NOT IMPLEMENTED YET")
        }
    }
)

export const startBiPathfindingAsync = createAsyncThunk(
    "biPathfinding/fetchBiPathfinding",
    async (data: {
        boardStatus: BoardStatus,
        algorithm: BiPathfindingAlgorithm
    }) => {
        switch (data.algorithm) {
            case BiPathfindingAlgorithm.BI_DIJKSTRA:
                return fetchBiDijkstraAxios(data.boardStatus)
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
            state.forwardDistanceMap = new Map()
            state.backwardDistanceMap = new Map()
            state.status = "idle"
        }
    },

    extraReducers: (builder) => {
        builder.addCase(startPathfindingAsync.fulfilled, (state, action) => {
            state.distance = action.payload!.distance
            //is required because of serializing
            state.path = new Map(Object.entries(action.payload!.path))
            state.forwardDistanceMap = new Map(Object.entries(action.payload!.distanceMap))
            state.status = "active"

        })

        builder.addCase(startBiPathfindingAsync.fulfilled, (state, {payload}) => {
            state.distance = (payload)!.distance
            state.backwardDistanceMap = (payload)!.backwardDistanceMap
            //is required because of serializing
            state.path = new Map(Object.entries(payload!.path))
            state.forwardDistanceMap = new Map(Object.entries((payload)!.forwardDistanceMap))
            state.backwardDistanceMap = new Map(Object.entries((payload)!.backwardDistanceMap))
            state.status = "active"
        })

    }

})


export const {clear} = pathfindingSlice.actions;

export const selectPathfinding = (state: RootState) => state.pathfinding
export const selectDistance = (state: RootState) => state.pathfinding.distance
export const selectPath = (state: RootState) => state.pathfinding.path
export const selectForward = (state: RootState) => state.pathfinding.forwardDistanceMap
export const selectBackward = (state: RootState) => state.pathfinding.backwardDistanceMap
export const selectStatus = (state: RootState) => state.pathfinding.status

export default pathfindingSlice.reducer;