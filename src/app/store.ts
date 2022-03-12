import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import counterReducer from '../features/counter/counterSlice';
import dijkstraReducer from "../features/dijkstra/dijkstraSlice"

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    dijkstra: dijkstraReducer
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
