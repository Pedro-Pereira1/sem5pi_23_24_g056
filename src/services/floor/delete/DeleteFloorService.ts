import { Inject, Service } from "typedi";
import { Result } from "../../../core/logic/Result";
import { IFloorDTO } from "../../../dto/floor/IFloorDTO";
import IDeleteFloorService from "../../IServices/floor/delete/IDeleteFloorService";
import IFloorRepo from "../../IRepos/floor/IFloorRepo";
import config from "../../../../config";
import IBuildingRepo from "../../IRepos/building/IBuildingRepo";

@Service()
export default class DeleteFloorService implements IDeleteFloorService {
    
    constructor(
        @Inject(config.repos.floor.name) private floorRepo: IFloorRepo,
        @Inject(config.repos.building.name) private buildingRepo: IBuildingRepo
    ) {}


    public async deleteFloor(id: number): Promise<Result<IFloorDTO>> {
    

        return null;
    }

}