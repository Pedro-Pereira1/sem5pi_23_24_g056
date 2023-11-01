import { Inject, Service } from "typedi";
import { Result } from "../../../core/logic/Result";
import config from "../../../../config";
import IElevatorRepo from "../../IRepos/elevator/IElevatorRepo";
import { Elevator } from "../../../domain/Elevator/Elevator";
import ElevatorMap from "../../../mappers/elevator/ElevatorMap";
import ICreateElevatorService from "../../IServices/elevator/ICreateElevatorService";
import IElevatorDTO from "../../../dto/elevator/IElevatorDTO";
import { ElevatorIdentificationNumber } from "../../../domain/Elevator/ElevatorIdentificationNumber";
import { ElevatorBrand } from "../../../domain/Elevator/ElevatorBrand";
import { ElevatorSerialNumber } from "../../../domain/Elevator/ElevatorSerialNumber";
import { ElevatorModel } from "../../../domain/Elevator/ElevatorModel";
import { ElevatorDescription } from "../../../domain/Elevator/ElevatorDescription";
import IBuildingRepo from "../../IRepos/building/IBuildingRepo";
import ICreateElevatorDTO from "../../../dto/elevator/ICreateElevatorDTO";
import BuildingCode from "../../../domain/Building/BuildingCode";
import IFloorRepo from "../../IRepos/floor/IFloorRepo";
import { UniqueEntityID } from "../../../core/domain/UniqueEntityID";

@Service()
export default class CreateElevatorService implements ICreateElevatorService {

    constructor(
        @Inject(config.repos.elevator.name) private elevatorRepo: IElevatorRepo,
        @Inject(config.repos.building.name) private buildingRepo: IBuildingRepo,
        @Inject(config.repos.floor.name) private floorRepo: IFloorRepo
    ) { }

    public async createElevator(elevatorDto: ICreateElevatorDTO): Promise<Result<IElevatorDTO>> {
        try{
            const building = await this.buildingRepo.findByBuidingCode(new BuildingCode(elevatorDto.buildingCode))
            if (!building) throw new Error("Building does not exist!")

            const floor = await this.floorRepo.findById(elevatorDto.floorId)
            if (floor === null) throw new Error("Floor does not exist!")

            //console.log(floor.props.floormap.elevatorsId)

            const elevatorOrError = await Elevator.create(
                {
                    elevatorIdentificationNumber: ElevatorIdentificationNumber.create(elevatorDto.elevatorIdentificationNumber).getValue(),
                    elevatorBrand: ElevatorBrand.create(elevatorDto.elevatorBrand).getValue(),
                    elevatorDescription: ElevatorDescription.create(elevatorDto.elevatorDescription).getValue(),
                    elevatorModel: ElevatorModel.create(elevatorDto.elevatorModel).getValue(),
                    elevatorSerialNumber: ElevatorSerialNumber.create(elevatorDto.elevatorSerialNumber).getValue()
                }, new UniqueEntityID (1))
                
            
            if (elevatorOrError.isFailure) {
                return Result.fail<IElevatorDTO>(elevatorOrError.errorValue())
            }
            
            const elevatorResult = elevatorOrError.getValue();
            
            floor.addElevators(elevatorResult)
            await this.elevatorRepo.save(elevatorResult);

            await this.floorRepo.save(floor);
            const ElevatorDtoResult = ElevatorMap.toDto(elevatorResult) as IElevatorDTO

            return Result.ok<IElevatorDTO>(ElevatorDtoResult)

        } catch(e) {
            throw e
        }
    }
}