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

            let passagewayExists= await this.passagewayRepo.findById(createPassagewayDTO.passagewayId);
            if(passagewayExists != null) {
                return Result.fail<IPassagewayDTO>("Passageway already exists.");
            }

            let building1Result = await this.buildingRepo.findByBuidingCode(new BuildingCode(createPassagewayDTO.building1Id.toString()))
            if(building1Result == null) return Result.fail<IPassagewayDTO>("Building dont exists.");
            
            let building2Result = await this.buildingRepo.findByBuidingCode(new BuildingCode(createPassagewayDTO.building2Id.toString()))
            if(building2Result == null) return Result.fail<IPassagewayDTO>("Building dont exists.");

            if(building1Result.code.toString() === building2Result.code.toString()){
                return Result.fail<IPassagewayDTO>("Buildings are the same.");
            }
            
            if (!(building1Result.floorsNumber.includes(createPassagewayDTO.floor1Id) && building2Result.floorsNumber.includes(createPassagewayDTO.floor2Id))) {
                return Result.fail<IPassagewayDTO>("Building dont have this floors.");
            }
            
            const PassagewayOrError = await Passageway.create(createPassagewayDTO);

            if (PassagewayOrError.isFailure) {
                return Result.fail<IPassagewayDTO>(PassagewayOrError.errorValue())
            }
            
            const passagewayResult = PassagewayOrError.getValue()

            const floor1Result = await this.floorRepo.findById(createPassagewayDTO.floor1Id);
            floor1Result.addPassageway(passagewayResult);
            
            const floor2Result = await this.floorRepo.findById(createPassagewayDTO.floor2Id);
            floor2Result.addPassageway(passagewayResult);
         

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
