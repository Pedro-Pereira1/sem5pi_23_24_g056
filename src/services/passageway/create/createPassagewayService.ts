import { Inject, Service } from "typedi";
import { Result } from "../../../core/logic/Result";
import { IPassagewayDTO } from "../../../dto/passageway/IPassagewayDTO";
import ICreatePassagewayService from "../../IServices/passageway/create/ICreatePassagewayService";
import config from "../../../../config";
import IPassagewayRepo from "../../IRepos/passageway/IPassagewayRepo";
import { Passageway } from "../../../domain/Passageway/Passageway";
import { PassagewayMap } from "../../../mappers/passageway/PassagewayMap";
import { IFloorDTO } from "../../../dto/floor/IFloorDTO";
import { FloorMaper } from "../../../mappers/floor/FloorMaper";
import IFloorRepo from "../../IRepos/floor/IFloorRepo";
import { ICreatePassagewayDTO } from "../../../dto/passageway/ICreatePassagewayDTO";

@Service()
export default class CreatePassagewayService implements ICreatePassagewayService {

    constructor(
        @Inject(config.repos.passageway.name) private passagewayRepo: IPassagewayRepo,
        @Inject(config.repos.floor.name) private floorRepo: IFloorRepo,

    ) { }

    public async createPassageway(createPassagewayDTO: ICreatePassagewayDTO): Promise<Result<IPassagewayDTO>> {
        try{
            const PassagewayOrError = await Passageway.create(createPassagewayDTO)

            if (PassagewayOrError.isFailure) {
                return Result.fail<IPassagewayDTO>(PassagewayOrError.errorValue())
            }

            const passagewayResult = PassagewayOrError.getValue()

            const floor1Result = await this.floorRepo.findById(createPassagewayDTO.building1ID);
            floor1Result.map.passagewaysId.push(String(createPassagewayDTO.passagewayId));

            const floor2Result = await this.floorRepo.findById(createPassagewayDTO.building2ID);
            floor2Result.map.passagewaysId.push(String(createPassagewayDTO.passagewayId));

            await this.passagewayRepo.save(passagewayResult);

            await this.floorRepo.save(floor1Result);
            await this.floorRepo.save(floor2Result);

            const PassagewayDtoResult = PassagewayMap.toDto(passagewayResult) as IPassagewayDTO
            return Result.ok<IPassagewayDTO>(PassagewayDtoResult)

        } catch(e) {
            throw e
        }
    }
}
