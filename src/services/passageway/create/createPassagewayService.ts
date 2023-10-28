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

@Service()
export default class CreatePassagewayService implements ICreatePassagewayService {

    constructor(
        @Inject(config.repos.passageway.name) private passagewayRepo: IPassagewayRepo,
        @Inject(config.repos.floor.name) private floorRepo: IFloorRepo,
        @Inject(config.repos.building.name) private buildingRepo: IBuildingRepo,
    ) { }

    public async createPassageway(createPassagewayDTO: ICreatePassagewayDTO): Promise<Result<IPassagewayDTO>> {

        try{
            var building1Result = await this.buildingRepo.findByBuidingCode(new BuildingCode(createPassagewayDTO.building1Id.toString()))
            var building2Result = await this.buildingRepo.findByBuidingCode(new BuildingCode(createPassagewayDTO.building2Id.toString()))

            const maxWidhtB1 = building1Result.size.width;
            const maxLenghtB1 = building1Result.size.length;
            const maxWidhtB2 = building2Result.size.width;
            const maxLenghtB2 = building2Result.size.length;
            
            const PassagewayOrError = await Passageway.create(createPassagewayDTO,maxWidhtB1,maxLenghtB1,maxWidhtB2,maxLenghtB2)

            if (PassagewayOrError.isFailure) {
                return Result.fail<IPassagewayDTO>(PassagewayOrError.errorValue())
            }

            const passagewayResult = PassagewayOrError.getValue()

            if (await this.passagewayRepo.exists(passagewayResult)) {
                return Result.fail<IPassagewayDTO>("Passageway already exists.");
            }

            if (!(building1Result.floorsNumber.includes(createPassagewayDTO.floor1Id) && building2Result.floorsNumber.includes(createPassagewayDTO.floor2Id))) {
                return Result.fail<IPassagewayDTO>("Building dont have this floors.");
            }

            const floor1Result = await this.floorRepo.findById(createPassagewayDTO.floor1Id);
            floor1Result.addPassageway(passagewayResult);

            const floor2Result = await this.floorRepo.findById(createPassagewayDTO.floor2Id);
            floor2Result.addPassageway(passagewayResult);

            await this.passagewayRepo.save(passagewayResult);

            if(floor2Result.props.floormap.passagewaysId.length > 0 && floor1Result.props.floormap.passagewaysId.length > 0){
                await this.floorRepo.save(floor1Result);
                await this.floorRepo.save(floor2Result);
            }

            const PassagewayDtoResult = PassagewayMap.toDto(passagewayResult) as IPassagewayDTO
            return Result.ok<IPassagewayDTO>(PassagewayDtoResult)

        } catch(e) {
            throw e
        }
    }
}
