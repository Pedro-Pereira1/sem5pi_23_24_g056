import { Inject, Service } from "typedi";
import { Result } from "../../../core/logic/Result";
import config from "../../../../config";
import IListAllRoomsService from "../../IServices/room/IListAllRoomsService";
import BuildingCode from "../../../domain/Building/BuildingCode";
import IBuildingRepo from "../../IRepos/building/IBuildingRepo";
import RoomMap from "../../../mappers/room/RoomMap";
import IListAllRoomsInBuildingDTO from "../../../dto/room/IListAllRoomsInBuildingDTO";

@Service()
export default class ListAllRoomsService implements IListAllRoomsService {

    constructor(
        @Inject(config.repos.building.name) private buildingRepo: IBuildingRepo
    ) { }

    public async listAllRoomsInBuilding(buildingCode: string): Promise<Result<IListAllRoomsInBuildingDTO[]>> {
        try{
            const building = await this.buildingRepo.findByBuidingCode(new BuildingCode(buildingCode))
            if (building === null) return Result.fail<IListAllRoomsInBuildingDTO[]>('Building does not exist!')

            let roomsList: IListAllRoomsInBuildingDTO[] = []
            for (var floor of building.floors) {
                for (var anRoom of floor.props.floormap.props.rooms){
                    const roomrDto = RoomMap.toDtoList(anRoom, Number(floor.floorId.toValue()))
                    roomsList.push(roomrDto)
                }
            }

            if (roomsList.length === 0) return Result.fail<IListAllRoomsInBuildingDTO[]>('No rooms found!')

            return Result.ok<IListAllRoomsInBuildingDTO[]>(roomsList)

        } catch(e) {
            throw e
        }
    }
}