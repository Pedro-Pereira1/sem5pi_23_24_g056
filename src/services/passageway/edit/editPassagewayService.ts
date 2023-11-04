import {Inject, Service} from "typedi";
import config from "../../../../config";
import IFloorRepo from "../../IRepos/floor/IFloorRepo";
import {Result} from "../../../core/logic/Result";
import {Floor} from "../../../domain/Floor/Floor";
import IEditPassagewayService from "../../IServices/passageway/edit/IEditPassagewayService";
import {IPassagewayDTO} from "../../../dto/passageway/IPassagewayDTO";
import IEditPassagewayDTO from "../../../dto/passageway/IEditPassagewayDTO";
import IPassagewayRepo from "../../IRepos/passageway/IPassagewayRepo";
import {PassagewayMap} from "../../../mappers/passageway/PassagewayMap";

@Service()
export default class EditPassagewayService implements IEditPassagewayService {

    constructor(
        @Inject(config.repos.passageway.name) private passagewayRepo: IPassagewayRepo,
        @Inject(config.repos.floor.name) private floorRepo: IFloorRepo
    ) { }

    public async editPassageway(passagewayDTO:IEditPassagewayDTO): Promise<Result<IPassagewayDTO>> {
        try{
            const passageway = await this.passagewayRepo.findById(passagewayDTO.passagewayId)

            if (passageway === undefined) throw new Error("Passageway does not exist!")

            const currentFloors : Floor[] = await this.floorRepo.findByPassageway(Number(passageway.id.toValue()))

            const floor1 = await this.floorRepo.findById(passagewayDTO.floor1Id)
            const floor2 = await this.floorRepo.findById(passagewayDTO.floor2Id)
            let index = 0
            let isFloor1 = false
            let isFloor2 = false


            for(var floor of currentFloors){
                if(floor.floorId.toValue() !== floor1.floorId.toValue() && floor.floorId.toValue() !== floor2.floorId.toValue()) {
                    floor.removePassageway(passageway)
                    await this.floorRepo.save(floor);
                    index++
                }else if (floor.floorId.toValue() !== floor1.floorId.toValue()){
                    isFloor2 = true
                }else{
                    isFloor1 = true
                }
            }

            if(isFloor1 && index>0){
                floor2.addPassageway(passageway)
            }else if(isFloor2 && index > 0){
                floor1.addPassageway(passageway)
            } else if(index>0){
                floor1.addPassageway(passageway)
                floor2.addPassageway(passageway)
            }

            await this.floorRepo.save(floor1);
            await this.floorRepo.save(floor2);

            const passagewayDtoResult = PassagewayMap.toDto(passageway) as IPassagewayDTO

            return Result.ok<IPassagewayDTO>(passagewayDtoResult)

        } catch(e) {
            throw e
        }
    }
}