import { Inject, Service } from "typedi";
import { Result } from "../../../core/logic/Result";
import config from "../../../../config";
import IElevatorRepo from "../../IRepos/elevator/IElevatorRepo";
import { Elevator } from "../../../domain/Elevator/Elevator";
import ElevatorMap from "../../../mappers/elevator/ElevatorMap";
import IElevatorDTO from "../../../dto/elevator/IElevatorDTO";
import { ElevatorBrand } from "../../../domain/Elevator/ElevatorBrand";
import { ElevatorSerialNumber } from "../../../domain/Elevator/ElevatorSerialNumber";
import { ElevatorModel } from "../../../domain/Elevator/ElevatorModel";
import { ElevatorDescription } from "../../../domain/Elevator/ElevatorDescription";
import IBuildingRepo from "../../IRepos/building/IBuildingRepo";
import BuildingCode from "../../../domain/Building/BuildingCode";
import IFloorRepo from "../../IRepos/floor/IFloorRepo";
import { Floor } from "../../../domain/Floor/Floor";
import IEditElevatorService from "../../IServices/elevator/edit/IEditElevatorService";
import IEditElevatorDTO from "../../../dto/elevator/IEditElevatorDTO";

@Service()
export default class EditElevatorService implements IEditElevatorService {

    constructor(
        @Inject(config.repos.elevator.name) private elevatorRepo: IElevatorRepo,
        @Inject(config.repos.building.name) private buildingRepo: IBuildingRepo,
        @Inject(config.repos.floor.name) private floorRepo: IFloorRepo
    ) { }

    public async editElevator(elevatorDto: IEditElevatorDTO): Promise<Result<IElevatorDTO>> {
        try{
            const building = await this.buildingRepo.findByBuidingCode(new BuildingCode(elevatorDto.buildingCode))
            if (!building) return Result.fail<IElevatorDTO>('Building does not exist!')

            let theElevator: Elevator = undefined
            for (var floor of building.floors) {
                for (var elevator of floor.props.floormap.props.elevators){
                    if (elevator.props.elevatorIdentificationNumber.identificationNumber === elevatorDto.elevatorIdentificationNumber){
                        theElevator = elevator
                        break;
                    }
                }
            }

            if (theElevator === undefined) return Result.fail<IElevatorDTO>('Elevator does not exist!')

            if (elevatorDto.elevatorBrand !== undefined){
                if (elevatorDto.elevatorModel === undefined && theElevator.props.elevatorModel === null) return Result.fail<IElevatorDTO>('Brand was provided so Model is required!')

                const brandOrError = ElevatorBrand.create(elevatorDto.elevatorBrand)

                if (brandOrError.isFailure) return Result.fail<IElevatorDTO>(brandOrError.errorValue())

                theElevator.props.elevatorBrand = brandOrError.getValue()
                
                if (elevatorDto.elevatorModel !== undefined) {
                    const modelOrError = ElevatorModel.create(elevatorDto.elevatorModel)
                    if (modelOrError.isFailure) return Result.fail<IElevatorDTO>(modelOrError.errorValue())
                    
                    theElevator.props.elevatorModel = modelOrError.getValue()
                }
            }

            if (elevatorDto.elevatorDescription !== undefined) {
                const descriptionOrError =  ElevatorDescription.create(elevatorDto.elevatorDescription)
                if (descriptionOrError.isFailure) return Result.fail<IElevatorDTO>(descriptionOrError.errorValue())

                theElevator.props.elevatorDescription =descriptionOrError.getValue()
            }

            if (elevatorDto.elevatorSerialNumber !== undefined) {
                const serialNumberOrError = ElevatorSerialNumber.create(elevatorDto.elevatorSerialNumber)
                if (serialNumberOrError.isFailure) return Result.fail<IElevatorDTO>(serialNumberOrError.errorValue())

                theElevator.props.elevatorSerialNumber = serialNumberOrError.getValue()
            }

            await this.elevatorRepo.save(theElevator);

            if (elevatorDto.floorsIdToRemove !== undefined) {
                let floors: Floor[] = [];
                for (var floorId of elevatorDto.floorsIdToRemove) {
                    const floor = await this.floorRepo.findById(floorId)
                    if (floor === null) return Result.fail<IElevatorDTO>('Floor does not exist!')
                    floors.push(floor)
                }

                const floorsOfElevator = await this.floorRepo.findByElevator(Number(theElevator.id.toValue()))
                if (floorsOfElevator.length === 1) return Result.fail<IElevatorDTO>('Remove floor is not possible because elevator is only associated with one floor!')
    
                for (var floor of floors){
                    floor.removeElevator(theElevator)
                    await this.floorRepo.save(floor);
                }
            }

            if (elevatorDto.floorsIdToAdd !== undefined) {
                let floors: Floor[] = [];
                for (var floorId of elevatorDto.floorsIdToAdd) {
                    const floor = await this.floorRepo.findById(floorId)
                    if (floor === null) return Result.fail<IElevatorDTO>('Floor does not exist!')
                    if (building.props.floors.find((floorInList) => floorInList.id.toValue() === floor.id.toValue()) === undefined){ return Result.fail<IElevatorDTO>('Floor with id ' + floor.floorId.toValue() + ' does not belong in building ' + building.code.toValue())}
                    floors.push(floor)
                }
    
                for (var floor of floors){
                    floor.addElevators(theElevator)
                    await this.floorRepo.save(floor);
                }
            }
            
            const elevatorDtoResult = ElevatorMap.toDto(theElevator) as IElevatorDTO

            return Result.ok<IElevatorDTO>(elevatorDtoResult)

        } catch(e) {
            throw e
        }
    }
}