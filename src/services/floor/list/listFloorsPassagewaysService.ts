import {Inject, Service} from "typedi";
import config from "../../../../config";
import IBuildingRepo from "../../IRepos/building/IBuildingRepo";
import {Result} from "../../../core/logic/Result";
import BuildingCode from "../../../domain/Building/BuildingCode";
import {FloorMaper} from "../../../mappers/floor/FloorMaper";
import IListFloorsPassagewaysService from "../../IServices/floor/list/IListFloorsPassagewaysService";
import IFloorRepo from "../../IRepos/floor/IFloorRepo";
import {IListFloorPassagewaysDTO} from "../../../dto/floor/IListFloorPassagewaysDTO";

@Service()
export default class listFloorsPassagewaysService implements IListFloorsPassagewaysService {

    constructor(
        @Inject(config.repos.building.name) private buildingRepo: IBuildingRepo,
        @Inject(config.repos.floor.name) private floorRepo: IFloorRepo
    ) {
    }

    public async listFloorsPassageways(buildingCode: string): Promise<Result<IListFloorPassagewaysDTO[]>> {


        const buildingResult = await this.buildingRepo.findByBuidingCode(new BuildingCode(buildingCode))
        if (buildingResult === null) {
            return Result.fail<IListFloorPassagewaysDTO[]>(`Building ${buildingCode} not found`)
        }

        const floorsResult = buildingResult.floors

        if (floorsResult.length === 0) {
            return Result.fail<IListFloorPassagewaysDTO[]>(`Building ${buildingCode} has no floors`)
        }

        let resolve: IListFloorPassagewaysDTO[] = []

        for (var floor of floorsResult) {
            if (floor.map.passagewaysId.length > 0) {
                const floorsConnected: string[] = [];
                for (var passagewayId of floor.map.passagewaysId) {
                    const currentFloors = await this.floorRepo.findByPassageway(passagewayId)

                    for (var floor1 of currentFloors) {
                        if (floor1.floorId.toValue() !== floor.floorId.toValue()) {
                            floorsConnected.push(floor1.floorId.toString())
                            const building = await this.buildingRepo.findByFloor(Number(floor1.floorId.toValue()))
                            if (building !== null) {
                                floorsConnected.push(building.code.toString())
                            }
                        }
                    }
                }
                resolve.push(FloorMaper.toDtoList(floor, floorsConnected))
            }
        }

        return Result.ok<IListFloorPassagewaysDTO[]>(resolve)
    }

}