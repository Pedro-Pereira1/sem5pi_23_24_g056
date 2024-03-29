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
import { ElevatorID } from "../../../domain/Elevator/ElevatorID";
import { Floor } from "../../../domain/Floor/Floor";

@Service()
export default class CreateElevatorService implements ICreateElevatorService {

    constructor(
        @Inject(config.repos.elevator.name) private elevatorRepo: IElevatorRepo,
        @Inject(config.repos.building.name) private buildingRepo: IBuildingRepo,
        @Inject(config.repos.floor.name) private floorRepo: IFloorRepo
    ) { }

    public async createElevator(elevatorDto: ICreateElevatorDTO): Promise<Result<IElevatorDTO>> {
        try{
            if (await this.elevatorRepo.findById(elevatorDto.elevatorId) !== null) return Result.fail<IElevatorDTO>('An Elevator with this Id already exists!')

            const building = await this.buildingRepo.findByBuidingCode(new BuildingCode(elevatorDto.buildingCode))
            if (!building) return Result.fail<IElevatorDTO>('Building does not exist!')

           let maxIdNum = 1

            for (var floor of building.floors) {
                for (var elevatorId of floor.props.floormap.elevatorsId){
                    const elevator = await this.elevatorRepo.findById(elevatorId)
                    if (maxIdNum <= elevator.props.elevatorIdentificationNumber.identificationNumber){
                        maxIdNum = elevator.props.elevatorIdentificationNumber.identificationNumber + 1
                    }
                }
            }

            let floors: Floor[] = [];
            for (var floorId of elevatorDto.floorIds) {
                const floor = await this.floorRepo.findById(floorId)
                if (floor === null) return Result.fail<IElevatorDTO>('Floor does not exist!')
                if (building.props.floors.find((floorInList) => floorInList.id.toValue() === floor.id.toValue()) === undefined){ return Result.fail<IElevatorDTO>('Floor with id ' + floor.floorId.toValue() + ' does not belong in building ' + building.code.toValue())}
                floors.push(floor)
            }
            
            if (elevatorDto.elevatorBrand !== undefined && elevatorDto.elevatorModel === undefined) return Result.fail<IElevatorDTO>('Brand was provided so Model is also required!')
            
            const elevatorOrError = await Elevator.create(
                {
                    elevatorIdentificationNumber: ElevatorIdentificationNumber.create(maxIdNum).getValue(),
                    elevatorBrand: ElevatorBrand.create(elevatorDto.elevatorBrand).getValue(),
                    elevatorDescription: ElevatorDescription.create(elevatorDto.elevatorDescription).getValue(),
                    elevatorModel: ElevatorModel.create(elevatorDto.elevatorModel).getValue(),
                    elevatorSerialNumber: ElevatorSerialNumber.create(elevatorDto.elevatorSerialNumber).getValue()
                }, ElevatorID.create(elevatorDto.elevatorId).getValue())
                
            
            if (elevatorOrError.isFailure) {
                return Result.fail<IElevatorDTO>(elevatorOrError.errorValue())
            }
            
            const elevatorResult = elevatorOrError.getValue();
            await this.elevatorRepo.save(elevatorResult);

            for (var floor of floors){
                floor.addElevators(elevatorResult)
                await this.floorRepo.save(floor);
            }
            
            const ElevatorDtoResult = ElevatorMap.toDto(elevatorResult) as IElevatorDTO

            return Result.ok<IElevatorDTO>(ElevatorDtoResult)

        } catch(e) {
            throw e
        }
    }
}