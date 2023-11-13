import { Inject, Service } from "typedi";
import { Result } from "../../../core/logic/Result";
import { IFloorDTO } from "../../../dto/floor/IFloorDTO";
import IDeleteFloorService from "../../IServices/floor/delete/IDeleteFloorService";
import IFloorRepo from "../../IRepos/floor/IFloorRepo";
import config from "../../../../config";
import IBuildingRepo from "../../IRepos/building/IBuildingRepo";
import { FloorMaper } from "../../../mappers/floor/FloorMaper";
import IElevatorRepo from "../../IRepos/elevator/IElevatorRepo";
import IRoomRepo from "../../IRepos/room/IRoomRepo";
import IPassagewayRepo from "../../IRepos/passageway/IPassagewayRepo";
import { copyFileSync } from "fs";

@Service()
export default class DeleteFloorService implements IDeleteFloorService {

    constructor(
        @Inject(config.repos.floor.name) private floorRepo: IFloorRepo,
        @Inject(config.repos.building.name) private buildingRepo: IBuildingRepo,
        @Inject(config.repos.elevator.name) private elevatorRepo: IElevatorRepo,
        @Inject(config.repos.room.name) private roomRepo: IRoomRepo,
        @Inject(config.repos.passageway.name) private passagewayRepo: IPassagewayRepo
    ) {}


    public async deleteFloor(id: number): Promise<Result<string>> {

        try {
            const floor = await this.floorRepo.findById(id);

            if (floor === null) {
                return Result.fail<string>('Floor not found');
            }

            const building = await this.buildingRepo.findByFloor(id);
            if (building === null) {
                return Result.fail<string>('building not found');
            }

            building.removeFloor(id);

            await this.buildingRepo.save(building);

            const deleted = await this.floorRepo.deleteFloor(id);

            if (deleted === false) {
                return Result.fail<string>('Floor not deleted');
            }


            return Result.ok<string>('Floor deleted');

        } catch (error) {
            console.log(error)
            return Result.fail<string>('error');
        }


        return null;
    }

}