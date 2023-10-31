import { Inject, Service } from "typedi";
import { IBuildingDTO } from "../../../dto/building/IBuildingDTO";
import IEditBuildingService from "../../IServices/building/IEditBuildingService";
import config from "../../../../config";
import IBuildingRepo from "../../IRepos/building/IBuildingRepo";
import { Building } from "../../../domain/Building/Building";
import { BuildingName } from "../../../domain/Building/BuildingName";
import { BuildingSize } from "../../../domain/Building/BuildingSize";
import { BuildingDescription } from "../../../domain/Building/BuildingDescription";
import { Result } from "../../../core/logic/Result";
import { BuildingMap } from "../../../mappers/building/BuildingMap";

@Service()
export default class EditBuildingService implements IEditBuildingService {


    constructor(
        @Inject(config.repos.building.name) private buildingRepo: IBuildingRepo
    ) {}

    public async editBuilding(buildingDto: IBuildingDTO): Promise<Result<IBuildingDTO>> {
        try {
            const buildingOrError = Building.create(
                {
                    buildingName: new BuildingName({ value: buildingDto.buildingName }),
                    buildingDescription: new BuildingDescription({ value: buildingDto.buildingDescription }),
                    buildingSize: new BuildingSize({ length: buildingDto.buildingLength, width: buildingDto.buildingWidth }),
                    floors: [],
                }, buildingDto.buildingCode
            )


            if (buildingOrError.isFailure) {
                return Result.fail<IBuildingDTO>(buildingOrError.errorValue())
            }

            const buildingResult = buildingOrError.getValue()

            if (!this.buildingRepo.exists(buildingResult)) {
                return Result.fail<IBuildingDTO>('Building doesn\'t exist')
            }

            await this.buildingRepo.save(buildingResult);

            const buildingDtoResult = BuildingMap.toDto(buildingResult) as IBuildingDTO
            return Result.ok<IBuildingDTO>(buildingDtoResult)

        } catch (err) {
            throw err
        }
    }
}