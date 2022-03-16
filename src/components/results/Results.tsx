import {useAppSelector} from "../../redux/app/hooks";
import {selectDistance} from "../../redux/features/pathfinding/pathfindingSlice";


export const Results = () => {

    const distance = useAppSelector(selectDistance)

    return (
        <div>
            <h1>The fastest distance is {distance} </h1>
        </div>
    )
}