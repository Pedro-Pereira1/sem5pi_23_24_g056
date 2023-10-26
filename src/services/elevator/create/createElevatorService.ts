import { Inject, Service } from "typedi";
import { Result } from "../../../core/logic/Result";
import config from "../../../../config";
import IElevatorRepo from "../../IRepos/elevator/IElevatorRepo";
import { Elevator } from "../../../domain/Elevator/Elevator";
import ElevatorMap from "../../../mappers/elevator/ElevatorMap";
import ICreateElevatorService from "../../IServices/elevator/ICreateElevatorService";
import IElevatorDTO from "../../../dto/elevator/IElevatorDTO";
import { ElevatorCoordinateX } from "../../../domain/Elevator/ElevatorCoordinateX";
import { ElevatorCoordinateY } from "../../../domain/Elevator/ElevatorCoordinateY";
import { ElevatorIdentificationNumber } from "../../../domain/Elevator/ElevatorIdentificationNumber";
import { ElevatorBrand } from "../../../domain/Elevator/ElevatorBrand";
import { ElevatorSerialNumber } from "../../../domain/Elevator/ElevatorSerialNumber";
import { ElevatorModel } from "../../../domain/Elevator/ElevatorModel";
import { ElevatorDescription } from "../../../domain/Elevator/ElevatorDescription";


@Service()
export default class CreateElevatorService implements ICreateElevatorService {

    constructor(
        @Inject(config.repos.elevator.name) private elevatorRepo: IElevatorRepo
    ) { }
    createPassageway(PassagewayDTO: IElevatorDTO): Promise<Result<IElevatorDTO>> {
        throw new Error("Method not implemented.");
    }

    public async createElevator(elevatorDto: IElevatorDTO): Promise<Result<IElevatorDTO>> {
        try{
            const ElevatorOrError = await Elevator.create(
                {
                    elevatorCoordinateX: new ElevatorCoordinateX({elevatorCoordinateX: elevatorDto.elevatorCoordinateX}),
                    elevatorCoordinateY: new ElevatorCoordinateY({elevatorCoordinateY: elevatorDto.elevatorCoordinateY}),
                    elevatorIdentificationNumber: new ElevatorIdentificationNumber({identificationNumber: elevatorDto.elevatorIdentificationNumber}),
                    elevatorBrand: new ElevatorBrand({brand: elevatorDto.elevatorBrand}),
                    elevatorDescription: new ElevatorDescription({description: elevatorDto.elevatorDescription}),
                    elevatorModel: new ElevatorModel({model: elevatorDto.elevatorModel}),
                    elevatorSerialNumber: new ElevatorSerialNumber({serialNumber: elevatorDto.elevatorSerialNumber})
                })

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