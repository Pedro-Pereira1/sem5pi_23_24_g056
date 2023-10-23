import { Inject, Service } from "typedi";
import { Result } from "../../../core/logic/Result";
import { IFloorDTO } from "../../../dto/floor/IFloorDTO";
import ICreateFloorService from "../../IServices/floor/create/ICreateFloorService";
import config from "../../../../config";
import IFloorRepo from "../../IRepos/floor/IFloorRepo";
import { Floor } from "../../../domain/Floor/Floor";
import { FloorMap } from "../../../mappers/floor/FloorMap";

@Service()
export default class CreateFloorService implements ICreateFloorService {

    constructor(
        @Inject(config.repos.floor.name) private floorRepo: IFloorRepo
    ) { }

    public async createFloor(FloorDto: IFloorDTO): Promise<Result<IFloorDTO>> {
        try{
            const FloorOrError = await Floor.create(FloorDto)

            if (FloorOrError.isFailure) {
                return Result.fail<IFloorDTO>(FloorOrError.errorValue())
            }

            const floorResult = FloorOrError.getValue()

            await this.floorRepo.save(floorResult);

            const floorDtoResult = FloorMap.toDto(floorResult) as IFloorDTO
            return Result.ok<IFloorDTO>(floorDtoResult)

        } catch(e) {
            throw e
        }
    }
}