
import {BoardStatus} from "./dijkstraSlice";

export const fetchDijkstra = async ({
                                        startPoint,
                                        endPoint,
                                        walls,
                                        height,
                                        width
                                    }: BoardStatus): Promise<DijkstraPromise> => {

    let response = await fetch("http://localhost:6969/api/dijkstra", {
        method: "Post",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            "height": height,
            "width": width,
            "startPoint": startPoint,
            "endPoint": endPoint,
            "walls": walls
        })
    })
    return response.json()

}

interface DijkstraPromise {
    distance: number
    distanceMap: Map<string, number>
    end: number[]
    start: number[]
    path: Map<string, null>
}