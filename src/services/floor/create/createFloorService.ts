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
import IBuildingRepo from "../../IRepos/building/IBuildingRepo";
import { IBuildingDTO } from "../../../dto/building/IBuildingDTO";
import { BuildingMap } from "../../../mappers/building/BuildingMap";
import { ICreateFloorDTO } from "../../../dto/floor/ICreateFloorDTO";
import BuildingCode from "../../../domain/Building/BuildingCode";

@Service()
export default class CreateFloorService implements ICreateFloorService {

    constructor(
        @Inject(config.repos.floor.name) private floorRepo: IFloorRepo,
        @Inject(config.repos.building.name) private buildingRepo: IBuildingRepo
    ) { }

    public async createFloor(createFloorDTO: ICreateFloorDTO): Promise<Result<IFloorDTO>> {
        
        try {
            const FloorOrError = await Floor.create(
                {
                    floorDescription: new FloorDescription({ value: createFloorDTO.floorDescription }),
                    floorNumber: createFloorDTO.floorNumber,
                    floormap: new FloorMap({
                        map: [],
                        passageways: [],
                        elevators: [],
                        rooms: []
                    })
                }, createFloorDTO.floorId)


            if (FloorOrError.isFailure) {
                return Result.fail<IFloorDTO>(FloorOrError.errorValue())
            }

            
            const floorResult = FloorOrError.getValue()
            const buildingResult = await this.buildingRepo.findByBuidingCode(new BuildingCode(createFloorDTO.buildingCode))
            

            buildingResult.addFloor(floorResult);

            await this.floorRepo.save(floorResult);
            await this.buildingRepo.save(buildingResult);

            const floorDtoResult = FloorMaper.toDto(floorResult) as IFloorDTO
            return Result.ok<IFloorDTO>(floorDtoResult)

        } catch (e) {
            throw e
        }
    }
}
