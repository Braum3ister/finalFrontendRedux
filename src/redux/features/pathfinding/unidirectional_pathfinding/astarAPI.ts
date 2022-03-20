import axios, {AxiosResponse} from "axios"

import {BoardStatus} from "../../board/boardSlice";
import {PathfindingPromise} from "../pathfindingSlice";


export const fetchAStarAxios = async ({
                                             startPoint, endPoint, walls, height, width
                                         }: BoardStatus): Promise<PathfindingPromise> => {

    return axios.post<BoardStatus, AxiosResponse<PathfindingPromise>>("http://localhost:6969/api/astar", {

        "height": height,
        "width": width,
        "startPoint": startPoint,
        "endPoint": endPoint,
        "walls": walls

    }, {
        timeout: 500
    }).then((res) => res.data)

}