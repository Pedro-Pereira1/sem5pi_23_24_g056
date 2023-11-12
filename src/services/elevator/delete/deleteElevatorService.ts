import {Inject, Service} from "typedi";
import IEditElevatorService from "../../IServices/elevator/edit/IEditElevatorService";
import config from "../../../../config";
import IElevatorRepo from "../../IRepos/elevator/IElevatorRepo";
import IBuildingRepo from "../../IRepos/building/IBuildingRepo";
import IFloorRepo from "../../IRepos/floor/IFloorRepo";
import IEditElevatorDTO from "../../../dto/elevator/IEditElevatorDTO";
import {Result} from "../../../core/logic/Result";
import BuildingCode from "../../../domain/Building/BuildingCode";
import {Elevator} from "../../../domain/Elevator/Elevator";
import IDeleteElevatorService from "../../IServices/elevator/delete/IDeleteElevatorService";

@Service()
export default class DeleteElevatorService implements IDeleteElevatorService {

    constructor(
        @Inject(config.repos.elevator.name) private elevatorRepo: IElevatorRepo,
        @Inject(config.repos.building.name) private buildingRepo: IBuildingRepo,
        @Inject(config.repos.floor.name) private floorRepo: IFloorRepo
    ) { }

    public async deleteElevator(elevatorDto: IEditElevatorDTO): Promise<Result<boolean>> {
        try{

            const building = await this.buildingRepo.findByBuidingCode(new BuildingCode(elevatorDto.buildingCode))
            if (!building) return Result.fail<boolean>('Building does not exist!')

            let theElevator: Elevator = undefined
            for (var floor of building.floors) {
                for (var elevator of floor.props.floormap.props.elevators){
                    if (elevator.props.elevatorIdentificationNumber.identificationNumber === elevatorDto.elevatorIdentificationNumber){
                        theElevator = elevator
                        floor.removeElevator(elevator)
                        await this.floorRepo.save(floor);
                    }
                }
            }

            if (theElevator === undefined) return Result.fail<boolean>('Elevator does not exist!')

            await this.elevatorRepo.delete(theElevator);

            return Result.ok<boolean>(true)

        } catch(e) {
            throw e
        }
    }
}