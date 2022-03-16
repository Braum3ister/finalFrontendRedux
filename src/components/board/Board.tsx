import {BoardElement} from "../board-element/BoardElement";

import "./board.css"
import {selectHeight, selectWidth} from "../../features/board/boardSlice";
import {useAppSelector} from "../../app/hooks";

export const Board = () => {
    const height = useAppSelector(selectHeight)
    const width = useAppSelector(selectWidth)
    return (
        <div className={"board"}>
            {createBoard(height, width)}
        </div>
    )
}

const createBoard = (height: number, width: number) => {
    let output = []
    for (let i = 0; i < height; i++) {
        for (let j = 0; j < width; j++) {
            output.push(<BoardElement coordinate={[i, j]} key={`${i},${j}`}/>)
        }
    }
    return output;
}

