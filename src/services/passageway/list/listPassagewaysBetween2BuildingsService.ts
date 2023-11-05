import { Inject, Service } from "typedi";
import { Result } from "../../../core/logic/Result";
import { IPassagewayDTO } from "../../../dto/passageway/IPassagewayDTO";
import ICreatePassagewayService from "../../IServices/passageway/create/ICreatePassagewayService";
import config from "../../../../config";
import IPassagewayRepo from "../../IRepos/passageway/IPassagewayRepo";
import { Passageway } from "../../../domain/Passageway/Passageway";
import { PassagewayMap } from "../../../mappers/passageway/PassagewayMap";
import IFloorRepo from "../../IRepos/floor/IFloorRepo";
import { ICreatePassagewayDTO } from "../../../dto/passageway/ICreatePassagewayDTO";
import IBuildingRepo from "../../IRepos/building/IBuildingRepo";
import BuildingCode from "../../../domain/Building/BuildingCode";
import IListPassagewaysBetween2BuildingsService from "../../IServices/passageway/list/IListPassagewaysBetween2BuildingsService";
import { IListPassagewaysBetween2BuildingsDTO } from "../../../dto/passageway/IListPassagewaysBetween2BuildingsDTO";

@Service()
export default class ListPassagewaysBetween2BuildingsService implements IListPassagewaysBetween2BuildingsService {

    constructor(
        @Inject(config.repos.passageway.name) private passagewayRepo: IPassagewayRepo,
        @Inject(config.repos.building.name) private buildingRepo: IBuildingRepo
    ) { }

    public async listPassagewaysBetween2Buildings(building1Code: string, building2Code: string): Promise<Result<IListPassagewaysBetween2BuildingsDTO[]>> {
        try{
            const building1 = await this.buildingRepo.findByBuidingCode(new BuildingCode(building1Code))
            if (!building1) return Result.fail<IListPassagewaysBetween2BuildingsDTO[]>('Building does not exist!')
            
            const building2 = await this.buildingRepo.findByBuidingCode(new BuildingCode(building2Code))
            if (!building2) return Result.fail<IListPassagewaysBetween2BuildingsDTO[]>('Building does not exist!')
            
            let passagewaysList: IListPassagewaysBetween2BuildingsDTO[] = []
            for (var floor of building1.floors) {
                for (var passageway of floor.props.floormap.props.passageways) {
                    const floorOrUndefined = building2.floors.find((floor) => floor.map.passagewaysId.find((aPassagewayId) => aPassagewayId === passageway.id.toValue()))
                    
                    if (floorOrUndefined !== undefined){
                        passagewaysList.push(PassagewayMap.toDtoList(passageway, floor.floorNumber.number, floorOrUndefined.floorNumber.number))
                    } 
                }
            }

            if (passagewaysList.length === 0) return Result.fail<IListPassagewaysBetween2BuildingsDTO[]>('No passageways found!')
            
            return Result.ok<IListPassagewaysBetween2BuildingsDTO[]>(passagewaysList)
        } catch(e) {
            throw e
        }
    }
}
