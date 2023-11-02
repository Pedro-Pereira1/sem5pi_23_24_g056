import { Inject, Service } from "typedi";
import { Result } from "../../../core/logic/Result";
import { IBuildingDTO } from "../../../dto/building/IBuildingDTO";
import ICreateBuildingService from "../../IServices/building/ICreateBuildingService";
import config from "../../../../config";
import IBuildingRepo from "../../IRepos/building/IBuildingRepo";
import { Building } from "../../../domain/Building/Building";
import { BuildingMap } from "../../../mappers/building/BuildingMap";
import { BuildingName } from "../../../domain/Building/BuildingName";
import { Floor } from "../../../domain/Floor/Floor";
import { BuildingDescription } from "../../../domain/Building/BuildingDescription";
import { BuildingSize } from "../../../domain/Building/BuildingSize";
import BuildingCode from "../../../domain/Building/BuildingCode";

@Service()
export default class CreateBuildingService implements ICreateBuildingService {

    constructor(
        @Inject(config.repos.building.name) private buildingRepo: IBuildingRepo
    ) { }

    public async createBuilding(buildingDto: IBuildingDTO): Promise<Result<IBuildingDTO>> {
        try {
            if (await this.buildingRepo.findByBuidingCode(new BuildingCode(buildingDto.buildingCode)) !== null) return Result.fail<IBuildingDTO>('A building with that code already exists')
            const buildingOrError = Building.create(
                {
                    buildingName: new BuildingName({ value: buildingDto.buildingName }),
                    buildingDescription: new BuildingDescription({ value: buildingDto.buildingDescription}),
                    buildingSize: new BuildingSize({length: buildingDto.buildingLength, width: buildingDto.buildingWidth}),
                    floors: [],
                }, buildingDto.buildingCode)

            if (buildingOrError.isFailure) {
                return Result.fail<IBuildingDTO>(buildingOrError.errorValue())
            }

            const buildingResult = buildingOrError.getValue()

            await this.buildingRepo.save(buildingResult);

            const buildingDtoResult = BuildingMap.toDto(buildingResult) as IBuildingDTO
            return Result.ok<IBuildingDTO>(buildingDtoResult)

        } catch (e) {
            throw e
        }
    }
}