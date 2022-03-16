import "./board-element.css"
import {useAppDispatch, useAppSelector} from "../../redux/app/hooks";

import {selectPath, selectStatus, selectVisited} from "../../redux/features/pathfinding/pathfindingSlice";

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
    const path = useAppSelector(selectPath)
    const visited = useAppSelector(selectVisited)
    const active = useAppSelector(selectStatus)
    testSettingTheColor(board,visited, path, coordinate, setColor, color).then()
    return (
        <div className={`board-element ${color}`}
             onClick={() => handleClick(dispatch, active, startPoint, coordinate, endPoint)}/>
    )
}


const isSpecialPoint = (coordinateOfSpecialPoint: number[], coordinate: number[]) => {
    return (coordinateOfSpecialPoint[0] === coordinate[0] && coordinateOfSpecialPoint[1] === coordinate[1])
}

const testSettingTheColor = async (board: BoardStatus,visited:  Map<string, number>, path: Map<string, null>, coordinate: number[], setColor: (value: string) => void, oldValue: string) => {
    let possibleNewColor = await determineColor(board,visited, path, coordinate)
    if (oldValue === possibleNewColor) return;
    setColor(possibleNewColor)
}


const determineColor = async ({walls , startPoint, endPoint}: BoardStatus, visited:  Map<string, number>, path: Map<string, null>, coordinate: number[]) => {
    if (isSpecialPoint(startPoint, coordinate)) return "start"
    if (isSpecialPoint(endPoint, coordinate)) return "end";
    if (helperIsWall(walls, coordinate)) return "wall"
    let coordinateAsString = convertToString(coordinate[0], coordinate[1])
    if (visited.get(coordinateAsString) === undefined) return ""
    await waitAmount(visited.get(coordinateAsString)! * SPEED)
    if (path.has(coordinateAsString)) return "path"
    return "visited"
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