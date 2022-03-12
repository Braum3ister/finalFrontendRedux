import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {fetchDijkstra} from "./dijkstraAPI";
import {RootState} from "../../app/store";




export interface BoardStatus {
    width: number,
    height: number,
    startPoint: number[],
    distance: number
    endPoint: number[],
    found: number[][],
    walls: number[][],
    path: Map<string, null>,
    visited: Map<string, number>
    status: "active" | "idle" | "pending" | "failed",
}



const initialState: BoardStatus = {
    width: 20,
    distance: 0,
    height: 20,
    startPoint: [1, 2],
    endPoint: [8, 4],
    found: [],
    walls: [],
    path: new Map(),
    visited: new Map(),
    status: "idle"
}

export const startDijkstraAsync = createAsyncThunk(
    'dijkstra/fetchDijkstra',
    async (data: BoardStatus) => {
        return fetchDijkstra(data)
    }
);


export const dijkstraSlice = createSlice({
    name: "dijkstra",
    initialState,
    reducers: {
        clear: (state) => {
            state.found = []
            state.path = new Map()
            state.walls = []
            state.distance = 0
            state.status = "idle"
            state.visited = new Map()
        },
        changeWalls: (state, action: PayloadAction<number[]>) => {
            let coordinate = action.payload
            let elementRemoved = false;
            state.walls = state.walls.filter((wall) => {
                let output = wall[0] !== coordinate[0] || wall[1] !== coordinate[1]
                if (!output) elementRemoved = true;
                return output
            })
            if (elementRemoved) return;
            state.walls.push(action.payload)
        }
    },

    extraReducers: (builder) => {
        builder.addCase(startDijkstraAsync.fulfilled, (state, action) => {
            state.status = "active"
            state.distance = action.payload.distance
            //is required because of serializing
            state.path = new Map(Object.entries(action.payload.path))
            state.visited = new Map(Object.entries(action.payload.distanceMap))

        })
    }
})


export const { clear, changeWalls } = dijkstraSlice.actions;

export const selectHeight = (state: RootState) => state.dijkstra.height
export const selectWidth = (state: RootState) => state.dijkstra.width
export const selectDistance = (state: RootState) => state.dijkstra.distance
export const selectStartDijkstra = (state: RootState) => state.dijkstra
export const selectStartPoint = (state: RootState) => state.dijkstra.startPoint
export const selectEndPoint = (state: RootState) => state.dijkstra.endPoint
export const selectPath = (state: RootState) => state.dijkstra.path
export const selectVisited = (state: RootState) => state.dijkstra.visited
export const selectStatus = (state: RootState) => state.dijkstra.status
export const selectWalls = (state: RootState) => state.dijkstra.walls
export default dijkstraSlice.reducer;