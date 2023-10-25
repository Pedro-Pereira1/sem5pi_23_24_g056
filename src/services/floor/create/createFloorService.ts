import { Inject, Service } from "typedi";
import { Result } from "../../../core/logic/Result";
import { IFloorDTO } from "../../../dto/floor/IFloorDTO";
import ICreateFloorService from "../../IServices/floor/create/ICreateFloorService";
import config from "../../../../config";
import IFloorRepo from "../../IRepos/floor/IFloorRepo";
import { Floor } from "../../../domain/Floor/Floor";
import { FloorMaper } from "../../../mappers/floor/FloorMaper";
import { FloorDescription } from "../../../domain/Floor/FloorDescription";
import { FloorMap } from "../../../domain/Floor/FloorMap";

@Service()
export default class CreateFloorService implements ICreateFloorService {

    constructor(
        @Inject(config.repos.floor.name) private floorRepo: IFloorRepo
    ) { }

    public async createFloor(floorDto: IFloorDTO): Promise<Result<IFloorDTO>> {
        try {
            const FloorOrError = await Floor.create(
                {
                    floorDescription: new FloorDescription({ value: floorDto.floorDescription }),
                    floorNumber: floorDto.floorNumber,
                    floormap: new FloorMap({
                        map: [],
                        passageways: [],
                        elevators: [],
                        rooms: []
                    })
                }, floorDto.floorId)

            if (FloorOrError.isFailure) {
                return Result.fail<IFloorDTO>(FloorOrError.errorValue())
            }

            const floorResult = FloorOrError.getValue()

            await this.floorRepo.save(floorResult);

            const floorDtoResult = FloorMaper.toDto(floorResult) as IFloorDTO
            return Result.ok<IFloorDTO>(floorDtoResult)

        } catch (e) {
            throw e
        }
    }
}