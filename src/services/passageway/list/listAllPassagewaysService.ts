import {Inject, Service} from "typedi";
import config from "../../../../config";
import {Result} from "../../../core/logic/Result";
import IListAllPassagewaysService from "../../IServices/passageway/list/IListAllPassagewaysService";
import IEditPassagewayDTO from "../../../dto/passageway/IEditPassagewayDTO";
import IPassagewayRepo from "../../IRepos/passageway/IPassagewayRepo";
import IFloorRepo from "../../IRepos/floor/IFloorRepo";
import {PassagewayMap} from "../../../mappers/passageway/PassagewayMap";
import {IPassagewayDTO} from "../../../dto/passageway/IPassagewayDTO";

@Service()
export default class listAllPassagewaysService implements IListAllPassagewaysService {

    constructor(
        @Inject(config.repos.passageway.name) private passagewayRepo: IPassagewayRepo,
    @Inject(config.repos.floor.name) private floorRepo: IFloorRepo
    )
    {}

    public async listAllPassageways(): Promise<Result<IEditPassagewayDTO[]>> {
        const passageways = await this.passagewayRepo.findAll()
        const resolve: IEditPassagewayDTO[] = []

        if(passageways.length === 0) {
            return Result.fail<IEditPassagewayDTO[]>("null")
        }

        for(let passageway of passageways){
            const floors = await this.floorRepo.findByPassageway(Number(passageway.id.toValue()))
            resolve.push(PassagewayMap.toDtoListAll(passageway,Number(floors[0].floorId.toValue()),Number(floors[1].floorId.toValue())))
        }

        return Result.ok<IEditPassagewayDTO[]>(resolve)
    }

}