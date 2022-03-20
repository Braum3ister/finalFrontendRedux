import axios, {AxiosResponse} from "axios"

import {BoardStatus} from "../../board/boardSlice";
import {BiPathfindingPromise} from "../pathfindingSlice";




export const fetchBiAStarAxios = async ({
                                               startPoint, endPoint, walls, height, width
                                           }: BoardStatus): Promise<BiPathfindingPromise> => {

    return axios.post<BoardStatus, AxiosResponse<BiPathfindingPromise>>("http://localhost:6969/api/biastar", {

        "height": height,
        "width": width,
        "startPoint": startPoint,
        "endPoint": endPoint,
        "walls": walls

    }, {
        timeout: 500
    }).then((res) => res.data)

}