import { Inject, Service } from "typedi";
import { Result } from "../../../core/logic/Result";
import config from "../../../../config";
import IElevatorRepo from "../../IRepos/elevator/IElevatorRepo";
import { Elevator } from "../../../domain/Elevator/Elevator";
import ElevatorMap from "../../../mappers/elevator/ElevatorMap";
import ICreateElevatorService from "../../IServices/elevator/ICreateElevatorService";
import IElevatorDTO from "../../../dto/elevator/IElevatorDTO";


@Service()
export default class CreateElevatorService implements ICreateElevatorService {

    constructor(
        @Inject(config.repos.elevator.name) private elevatorRepo: IElevatorRepo
    ) { }
    createPassageway(PassagewayDTO: IElevatorDTO): Promise<Result<IElevatorDTO>> {
        throw new Error("Method not implemented.");
    }

    public async createElevator(ElevatorDto: IElevatorDTO): Promise<Result<IElevatorDTO>> {
        try{
            const ElevatorOrError = await Elevator.create(ElevatorDto)

            if (ElevatorOrError.isFailure) {
                return Result.fail<IElevatorDTO>(ElevatorOrError.errorValue())
            }

            const elevatorResult = ElevatorOrError.getValue()

            await this.elevatorRepo.save(elevatorResult);

            const ElevatorDtoResult = ElevatorMap.toDto(elevatorResult) as IElevatorDTO
            return Result.ok<IElevatorDTO>(ElevatorDtoResult)

        } catch(e) {
            throw e
        }
    }
}