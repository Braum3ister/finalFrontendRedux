import "./board-element.css"
import {useAppDispatch, useAppSelector} from "../../redux/app/hooks";

import {PathfindingStatus, selectPathfinding, selectStatus} from "../../redux/features/pathfinding/pathfindingSlice";

import {
    BoardStatus,
    changeWalls,
    selectBoard,
    selectEndPoint,
    selectStartPoint,
} from "../../redux/features/board/boardSlice"

import {useState} from "react";
import {AppDispatch} from "../../redux/app/store";


interface BoardElementProps {
    coordinate: number[]
}

const SPEED = 100


export const BoardElement = ({coordinate}: BoardElementProps) => {
    const [color, setColor] = useState("")
    const dispatch = useAppDispatch()
    const board = useAppSelector(selectBoard)
    const startPoint = useAppSelector(selectStartPoint)
    const endPoint = useAppSelector(selectEndPoint)
    const active = useAppSelector(selectStatus)


    const pathfinding = useAppSelector(selectPathfinding)
    testSettingTheColor(pathfinding, board, coordinate, setColor, color).then()
    return (
        <div className={`board-element ${color}`}
             onClick={() => handleClick(dispatch, active, startPoint, coordinate, endPoint)}/>
    )
}


const testSettingTheColor = async (pathfinding: PathfindingStatus, board: BoardStatus, coordinate: number[], setColor: (value: string) => void, oldValue: string) => {
    let possibleNewColor = await findColor(pathfinding, board, coordinate)
    if (oldValue === possibleNewColor.color && possibleNewColor.willChange) return;
    setColor(possibleNewColor.color);
    //await waitAmount(possibleNewColor.amountToWait * SPEED)

    /**
     * Check if both visited and or not path
     */
    //return setColor("double-visited")

}


const findColor = async ({
                             forwardDistanceMap,
                             backwardDistanceMap,
                             path
                         }: PathfindingStatus, board: BoardStatus, coordinate: number[]) => {


    /**
     * is special Point
     */
    let evaluateSpecialPoint = getColorOfSpecialPoint(board.startPoint, board.endPoint, board.walls, coordinate)
    if (evaluateSpecialPoint != "") return new ResultOfColor(evaluateSpecialPoint);

    /**
     * Is never found
     */
    let coordinateAsString = convertToString(coordinate[0], coordinate[1])
    let forwardDistance = forwardDistanceMap.get(coordinateAsString)
    let backwardDistance = backwardDistanceMap.get(coordinateAsString)
    if (forwardDistance === undefined
        && backwardDistance === undefined) return new ResultOfColor("")

    /**
     * Render Forward and Render Backward
     */
    if (forwardDistance && backwardDistance) {
        await waitAmount(SPEED * (forwardDistance <= backwardDistance ? forwardDistance : backwardDistance))
        if (path.has(coordinateAsString)) return new ResultOfColor("path");
        return new ResultOfColor("visited", true, Math.abs(forwardDistance - backwardDistance))
    }

    if (forwardDistance) {
        await waitAmount(SPEED * forwardDistance)
        if (path.has(coordinateAsString)) return new ResultOfColor("path");
        return new ResultOfColor("visited")
    }

    if (backwardDistance) {
        await waitAmount(SPEED * backwardDistance)
        if (path.has(coordinateAsString)) return new ResultOfColor("path");
        return new ResultOfColor("visited")
    }
    /**
     * Maybe throw an error
     */
    return new ResultOfColor("")

}

class ResultOfColor {
    color: string
    willChange: boolean
    amountToWait: number

    constructor(color: string, willChange: boolean = false, amountToWait: number = 0) {
        this.color = color
        this.willChange = willChange
        this.amountToWait = amountToWait
    }
}

const getColorOfSpecialPoint = (startPoint: number[], endPoint: number[], walls: number[][], coordinate: number[]) => {
    if (isSpecialPoint(startPoint, coordinate)) return "start"
    if (isSpecialPoint(endPoint, coordinate)) return "end";
    if (helperIsWall(walls, coordinate)) return "wall"
    return ""
}


const isSpecialPoint = (coordinateOfSpecialPoint: number[], coordinate: number[]) => {
    return (coordinateOfSpecialPoint[0] === coordinate[0] && coordinateOfSpecialPoint[1] === coordinate[1])
}


const waitAmount = (amount: number) => {
    return new Promise(resolve => setTimeout(resolve, amount));
}

export const helperIsWall = (walls: number[][], coordinate: number[]): boolean => {
    for (let wall of walls) {
        if (wall[0] === coordinate[0] && wall[1] === coordinate[1]) return true;
    }
    return false
}


export const convertToString = (x: number, y: number) => {
    return `${x},${y}`
}

const handleClick = (dispatch: AppDispatch, isActive: "active" | "idle" | "pending" | "failed"
    , startPoint: number[], coordinate: number[], endPoint: number[]) => {
    if (isActive === "active") return;
    if (isSpecialPoint(startPoint, coordinate)) return;
    if (isSpecialPoint(endPoint, coordinate)) return;
    dispatch(changeWalls(coordinate))
}