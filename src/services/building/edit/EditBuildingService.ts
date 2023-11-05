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
import BuildingCode from "../../../domain/Building/BuildingCode";

@Service()
export default class EditBuildingService implements IEditBuildingService {


    constructor(
        @Inject(config.repos.building.name) private buildingRepo: IBuildingRepo
    ) {}

    public async editBuilding(buildingDto: IBuildingDTO): Promise<Result<IBuildingDTO>> {
        try {
            const buildingOrError = await this.buildingRepo.findByBuidingCode(new BuildingCode(buildingDto.buildingCode))

            if (buildingOrError === null) {
                return Result.fail<IBuildingDTO>('There is no building with that code')
            }

            if (buildingDto.buildingName !== undefined || buildingDto.buildingName !== null) {
                buildingOrError.changeName(buildingDto.buildingName)
            }

            if (buildingDto.buildingDescription !== undefined || buildingDto.buildingDescription !== null) {
                buildingOrError.changeDescription(buildingDto.buildingDescription)
            }

            if (buildingDto.buildingLength !== undefined || buildingDto.buildingLength !== null &&
                buildingDto.buildingWidth !== undefined || buildingDto.buildingWidth !== null) {
                buildingOrError.changeSize(buildingDto.buildingLength, buildingDto.buildingWidth)
            }

            await this.buildingRepo.save(buildingOrError);

            const buildingDtoResult = BuildingMap.toDto(buildingOrError)
            return Result.ok<IBuildingDTO>(buildingDtoResult)

        } catch (err) {
            throw err
        }
    }
}