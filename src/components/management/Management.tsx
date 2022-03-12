import "./management.css"
import {useAppDispatch, useAppSelector} from "../../app/hooks";
import {clear, selectStartDijkstra, startDijkstraAsync} from "../../features/dijkstra/dijkstraSlice";


export const Management = () => {
    const dispatch = useAppDispatch()
    const dijkstraInfo = useAppSelector(selectStartDijkstra)
    return (
        <div className={"task-bar container"}>
            <button className={"btn"} onClick={(e) => {
                e.preventDefault()
                dispatch(startDijkstraAsync(dijkstraInfo))
            }}>
                Start Dijkstra
            </button>
            <button className={"btn"} onClick={(e) => {
                e.preventDefault()
                dispatch(clear())
            }}>
                Reset
            </button>
        </div>
    )
}