import { Inject, Service } from "typedi";
import { Result } from "../../../core/logic/Result";
import { IPassagewayDTO } from "../../../dto/passageway/IPassagewayDTO";
import ICreatePassagewayService from "../../IServices/passageway/create/ICreatePassagewayService";
import config from "../../../../config";
import IPassagewayRepo from "../../IRepos/passageway/IPassagewayRepo";
import { Passageway } from "../../../domain/Passageway/Passageway";
import { PassagewayMap } from "../../../mappers/passageway/PassagewayMap";

@Service()
export default class CreatePassagewayService implements ICreatePassagewayService {

    constructor(
        @Inject(config.repos.passageway.name) private passagewayRepo: IPassagewayRepo
    ) { }

    public async createPassageway(PassagewayDto: IPassagewayDTO): Promise<Result<IPassagewayDTO>> {
        try{
            const PassagewayOrError = await Passageway.create(PassagewayDto)

            if (PassagewayOrError.isFailure) {
                return Result.fail<IPassagewayDTO>(PassagewayOrError.errorValue())
            }

            const passagewayResult = PassagewayOrError.getValue()

            await this.passagewayRepo.save(passagewayResult);

            const PassagewayDtoResult = PassagewayMap.toDto(passagewayResult) as IPassagewayDTO
            return Result.ok<IPassagewayDTO>(PassagewayDtoResult)

        } catch(e) {
            throw e
        }
    }
}