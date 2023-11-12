import { Inject, Service } from "typedi";
import { Result } from "../../../core/logic/Result";
import { IBuildingDTO } from "../../../dto/building/IBuildingDTO";
import IListAllBuildingsService from "../../IServices/building/IListAllBuildingsService";
import IBuildingRepo from "../../IRepos/building/IBuildingRepo";
import config from "../../../../config";
import { Building } from "../../../domain/Building/Building";
import { BuildingMap } from "../../../mappers/building/BuildingMap";
import IListAllRobotTypeService from "../../IServices/robotType/list/IListAllRobotTypeService";
import { IRobotTypeDTO } from "../../../dto/robotType/IRobotTypeDTO";
import { RobotTypeMap } from "../../../mappers/robotType/RobotTypeMap";
import IRobotTypeRepo from "../../IRepos/robotType/IRobotTypeRepo";

@Service()
export default class listAllRobotTypeService implements IListAllRobotTypeService {

    constructor(
        @Inject(config.repos.robotType.name) private robotTypeRepo: IRobotTypeRepo
    )
    {}

    public async listAllRobotTypes(): Promise<Result<IRobotTypeDTO[]>> {
        const buildings = await this.robotTypeRepo.findAll()

        if(buildings.length === 0) {
            return Result.fail<IRobotTypeDTO[]>("null")
        }
        
        let resolve: IRobotTypeDTO[] = []

        buildings.forEach(b => {
            resolve.push(RobotTypeMap.toDto(b))
        })
        
        return Result.ok<IRobotTypeDTO[]>(resolve)
    }

}