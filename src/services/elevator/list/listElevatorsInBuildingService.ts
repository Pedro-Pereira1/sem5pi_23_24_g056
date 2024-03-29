import { Inject, Service } from "typedi";
import { Result } from "../../../core/logic/Result";
import config from "../../../../config";
import IElevatorRepo from "../../IRepos/elevator/IElevatorRepo";
import ElevatorMap from "../../../mappers/elevator/ElevatorMap";
import IBuildingRepo from "../../IRepos/building/IBuildingRepo";
import BuildingCode from "../../../domain/Building/BuildingCode";
import IListElevatorsInBuildingService from "../../IServices/elevator/list/IListElevatorsInBuildingService";
import IListElevatorsInBuildingDTO from "../../../dto/elevator/IListElevatorsInBuildingDTO";

@Service()
export default class ListElevatorsInBuildingService implements IListElevatorsInBuildingService {

    constructor(
        @Inject(config.repos.building.name) private buildingRepo: IBuildingRepo,
    ) { }

    public async listElevatorsInBuilding(buildingCode: string): Promise<Result<IListElevatorsInBuildingDTO[]>> {
        try{
            const building = await this.buildingRepo.findByBuidingCode(new BuildingCode(buildingCode))
            if (building === null) return Result.fail<IListElevatorsInBuildingDTO[]>('Building does not exist!')

            let elevatorsList: IListElevatorsInBuildingDTO[] = []
            for (var floor of building.floors) {
                for (var anElevator of floor.props.floormap.props.elevators){
                    const elevatorDto = ElevatorMap.toDtoList(anElevator, [floor.props.floorNumber.number])

                    const elevatorOrUndefined = elevatorsList.find((elevator) => elevator.elevatorId === elevatorDto.elevatorId)
                    if (elevatorOrUndefined === undefined){
                        elevatorsList.push(elevatorDto)
                    } else {
                        elevatorOrUndefined.floorsNumber.push(elevatorDto.floorsNumber.at(0))
                    }
                }
            }

            if (elevatorsList.length === 0) return Result.fail<IListElevatorsInBuildingDTO[]>('No elevators found!')

            return Result.ok<IListElevatorsInBuildingDTO[]>(elevatorsList)

        } catch(e) {
            throw e
        }
    }
}