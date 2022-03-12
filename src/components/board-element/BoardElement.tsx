import "./board-element.css"
import {useAppDispatch, useAppSelector} from "../../app/hooks";

import {
    changeWalls,
    selectEndPoint,
    selectPath,
    selectStartPoint,
    selectStatus,
    selectVisited, selectWalls
} from "../../features/dijkstra/dijkstraSlice";
import {useState} from "react";
import {AppDispatch} from "../../app/store";


interface BoardElementProps {
    coordinate: number[]
}


export const BoardElement = ({coordinate}: BoardElementProps) => {
    const [color, setColor] = useState("")
    const dispatch = useAppDispatch()
    const startPoint = useAppSelector(selectStartPoint)
    const endPoint = useAppSelector(selectEndPoint)
    const path = useAppSelector(selectPath)
    const visited = useAppSelector(selectVisited)
    const active = useAppSelector(selectStatus)
    const walls = useAppSelector(selectWalls)
    testSettingTheColor(walls, startPoint, path, visited, endPoint, coordinate, setColor, color).then()
    return (
        <div className={`board-element ${color}`} onClick={() => handleClick(dispatch, active, startPoint, coordinate, endPoint)}/>
    )
}


const isSpecialPoint = (coordinateOfSpecialPoint: number[], coordinate: number[]) => {
    return (coordinateOfSpecialPoint[0] === coordinate[0] && coordinateOfSpecialPoint[1] === coordinate[1])
}

const testSettingTheColor = async (walls: number[][],startPoint: number[], path: Map<string, null>, visited: Map<string, number>, endPoint: number[], coordinate: number[], setColor: (value: string) => void, oldValue: string) => {
    let possibleNewColor = await determineColor(walls,startPoint, path, visited, endPoint, coordinate)
    if (oldValue === possibleNewColor) return;
    setColor(possibleNewColor)
}


const determineColor = async (walls: number[][], startPoint: number[], path: Map<string, null>, visited: Map<string, number>, endPoint: number[], coordinate: number[]) => {
    if (isSpecialPoint(startPoint, coordinate)) return "red"
    if (isSpecialPoint(endPoint, coordinate)) return "green";
    if (helperIsWall(walls, coordinate)) return "black"
    let coordinateAsString = convertToString(coordinate[0], coordinate[1])
    if (visited.get(coordinateAsString) === undefined) return ""
    await new Promise(resolve => setTimeout(resolve, visited.get(coordinateAsString)! * 500));
    if (path.has(coordinateAsString)) return "blue"
    return "yellow"
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