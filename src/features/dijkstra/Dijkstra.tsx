
import {useAppDispatch} from "../../app/hooks";
import {startDijkstraAsync} from "./dijkstraSlice";
import {store} from "../../app/store";


export const Dijkstra = () => {
    const dispatch = useAppDispatch();

    return (

            <button
                aria-label="Decrement value"
                onClick={() => dispatch(startDijkstraAsync(store.getState().dijkstra))}
            />

    )
}