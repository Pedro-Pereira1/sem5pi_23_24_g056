import { Repo } from "../../../core/infra/Repo";
import { Building } from "../../../domain/Building/Building";
import { BuildingName } from "../../../domain/Building/BuildingName";

export default interface IBuildingRepo extends Repo<Building> {
    save(building: Building): Promise<Building>
    findByBuildingName(buildingName: BuildingName): Promise<Building>
}