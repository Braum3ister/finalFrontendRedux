import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import counterReducer from '../features/counter/counterSlice';
import pathfindingReducer from "../features/pathfinding/pathfindingSlice"
import boardReducer from "../features/board/boardSlice"

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    pathfinding: pathfindingReducer,
    board: boardReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
