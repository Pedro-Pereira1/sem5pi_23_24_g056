import {Inject, Service} from "typedi";
import config from "../../../../config";
import IFloorRepo from "../../IRepos/floor/IFloorRepo";
import {Result} from "../../../core/logic/Result";
import IListAllElevatorsService from "../../IServices/elevator/list/IListAllElevatorsService";
import IListAllElevatorsDTO from "../../../dto/elevator/IListAllElevatorsDTO";
import IElevatorRepo from "../../IRepos/elevator/IElevatorRepo";
import ElevatorMap from "../../../mappers/elevator/ElevatorMap";
import IBuildingRepo from "../../IRepos/building/IBuildingRepo";
import { IFloorDTO } from "../../../dto/floor/IFloorDTO";
import { FloorMaper } from "../../../mappers/floor/FloorMaper";


@Service()
export default class listAllElevators implements IListAllElevatorsService {

    constructor(
        @Inject(config.repos.elevator.name) private elevatorRepo: IElevatorRepo,
        @Inject(config.repos.floor.name) private floorRepo: IFloorRepo,
        @Inject(config.repos.building.name) private buildingRepo: IBuildingRepo
    )
    {}

    public async listAllElevators(): Promise<Result<IListAllElevatorsDTO[]>> {
        const elevators = await this.elevatorRepo.findAll()
        const resolve: IListAllElevatorsDTO[] = []

        if(elevators.length === 0) {
            return Result.fail<IListAllElevatorsDTO[]>("null")
        }

        for(let elevator of elevators){
            const floors = await this.floorRepo.findByElevator(Number(elevator.id.toValue()))
            const building = await this.buildingRepo.findByFloor(Number(floors[0].floorId.toValue()))
            const floorsId: number[] = []
            for(let floor of floors){
                floorsId.push(Number(floor.floorId.toValue()))
            }
            resolve.push(ElevatorMap.toDtoListAll(elevator,floorsId,String(building.code.toValue())))
        }

        return Result.ok<IListAllElevatorsDTO[]>(resolve)
    }

    public async listFloorsByElevatorId(elevatorId: string): Promise<Result<IFloorDTO[]>> {
        const floors = await this.floorRepo.findByElevator(Number(elevatorId))
        const resolve: IFloorDTO[] = []

        if(floors.length === 0) {
            return Result.fail<IFloorDTO[]>("null")
        }

        for(let floor of floors){
            resolve.push(FloorMaper.toDto(floor))
        }

        return Result.ok<IFloorDTO[]>(resolve)
    }

}