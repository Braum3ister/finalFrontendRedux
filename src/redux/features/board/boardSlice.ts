import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {RootState} from "../../app/store";


export interface BoardStatus {
    width: number;
    height: number;
    startPoint: number[]
    endPoint: number[]
    /*
    Maybe refactor to Map for performance boost
     */
    walls: number[][]
}


const initialState: BoardStatus = {
    width: 20,
    height: 20,
    startPoint: [1, 2],
    endPoint: [15, 8],
    walls: [],
}

export const boardSlice = createSlice({
    name: "board",
    initialState,
    reducers: {
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

    }
})

export const {changeWalls} = boardSlice.actions;

export const selectWidth = (state: RootState) => state.board.width
export const selectHeight = (state: RootState) => state.board.height
export const selectStartPoint = (state: RootState) => state.board.startPoint
export const selectEndPoint = (state: RootState) => state.board.endPoint
export const selectWalls = (state: RootState) => state.board.walls
export const selectBoard = (state: RootState) => state.board

export default boardSlice.reducer
