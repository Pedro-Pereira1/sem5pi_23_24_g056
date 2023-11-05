import { Repo } from "../../../core/infra/Repo";
import { Result } from "../../../core/logic/Result";
import { Building } from "../../../domain/Building/Building";
import BuildingCode from "../../../domain/Building/BuildingCode";

export default interface IBuildingRepo extends Repo<Building> {
    save(building: Building): Promise<Building>
    findByBuidingCode(buildingCode: BuildingCode): Promise<Building>
    findAll(): Promise<Building[]>
    findBuildingsMaxMinFloors(max:number, min:number): Promise<Building[]>
    findByFloorId(floorId: number): Promise<Building>
}
