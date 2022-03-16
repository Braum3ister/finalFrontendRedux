import "./management.css"
import {useAppDispatch, useAppSelector} from "../../redux/app/hooks";
import {
    clear,
    PathfindingAlgorithm,
    selectStatus,
    startPathfindingAsync
} from "../../redux/features/pathfinding/pathfindingSlice";
import {BoardStatus, selectBoard} from "../../redux/features/board/boardSlice";
import {toast} from "react-toastify"
import 'react-toastify/dist/ReactToastify.css';
import {unwrapResult} from "@reduxjs/toolkit";
import {AppDispatch} from "../../redux/app/store";


export const Management = () => {
    const dispatch = useAppDispatch()
    const boardStatus = useAppSelector(selectBoard)
    const status = useAppSelector(selectStatus)
    return (
        <div className={"task-bar container"}>
            <button className={"btn"} onClick={(e) => {
                e.preventDefault()
                dispatchPathfinding(dispatch, boardStatus, PathfindingAlgorithm.DIJKSTRA, status)
            }}>
                Start Dijkstra
            </button>
            <button className={"btn"} onClick={(e) => {
                e.preventDefault()
                dispatchPathfinding(dispatch, boardStatus, PathfindingAlgorithm.A_STAR, status)
            }}>
                Start A*
            </button>

            <button className={"btn"} onClick={(e) => {
                e.preventDefault()
                dispatch(clear())
                dispatchInfoToast("Cleared")

            }}>
                Clear
            </button>
        </div>
    )
}

const dispatchPathfinding = (dispatch: AppDispatch, boardStatus: BoardStatus, algorithm: PathfindingAlgorithm
                             , status: "active" | 'idle' | 'pending' | 'failed') => {
    if (status === "active") {
        dispatchErrorToast()
        return
    }
    dispatchInfoToast("Started")

    dispatch(startPathfindingAsync({
        boardStatus,
        algorithm
    }))
        .then(unwrapResult)
        .catch((obj) => {
            toast.error(obj.message, {position: "bottom-center"}

            )
        });
}

const dispatchInfoToast = (message: string) => {
    toast.info(message, {
        position: "bottom-center",
        autoClose: 750,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
    });

}

const dispatchErrorToast = () => {
    toast.error("Wait or press Clear", {
        autoClose: 500,
        position: "bottom-center",
    })
}

