import { AggregateRoot } from '../../core/domain/AggregateRoot';
import { ElevatorCoordinates } from './ElevatorCoordinates';
import { ElevatorID } from './ElevatorID';
import IElevatorDTO from '../../dto/elevator/IElevatorDTO';
import { Result } from '../../core/logic/Result';
import { ElevatorIdentificationNumber } from './ElevatorIdentificationNumber';
import { ElevatorBrand } from './ElevatorBrand';
import { ElevatorDescription } from './ElevatorDescription';
import { ElevatorModel } from './ElevatorModel';
import { ElevatorSerialNumber } from './ElevatorSerialNumber';
import { stream } from 'winston';

interface ElevatorProps {
  elevatorCoordinates: ElevatorCoordinates;
  elevatorIdentificationNumber: ElevatorIdentificationNumber,
  elevatorBrand?: ElevatorBrand,
  elevatorDescription?: ElevatorDescription,
  elevatorModel?: ElevatorModel,
  elevatorSerialNumber?: ElevatorSerialNumber
}

export class Elevator extends AggregateRoot<ElevatorProps> {

  constructor(props: ElevatorProps, elevatorId: ElevatorID) {
    super(props, elevatorId);
  }

  public static create(elevatorDto: IElevatorDTO): Result<Elevator> {
    const elevatorId = elevatorDto.elevatorId
    const elevatorCoordinatesTopX = elevatorDto.elevatorCoordinatesTopX
    const elevatorCoordinatesTopY = elevatorDto.elevatorCoordinatesTopY
    const elevatorCoordinatesBottomX = elevatorDto.elevatorCoordinatesBottomX
    const elevatorCoordinatesBottomY = elevatorDto.elevatorCoordinatesBottomY
    const elevatorBrand = elevatorDto.elevatorBrand
    const elevatorIdentificationNumber = elevatorDto.elevatorIdentificationNumber
    const elevatorDescription = elevatorDto.elevatorDescription
    const elevatorModel = elevatorDto.elevatorModel
    const elevatorSerialNumber = elevatorDto.elevatorSerialNumber

    if (!checkBrand(elevatorBrand) || !checkIdentificationNumber(elevatorIdentificationNumber) || !checkDescription(elevatorDescription) || !checkModel(elevatorModel) || checkSerialNumber(elevatorSerialNumber)) {
      return Result.fail<Elevator>('Wrong Parameters')
    }
  
    if (elevatorBrand.length > 0 && elevatorModel.length < 1) {
      return Result.fail<Elevator>('Brand was given so model is requiered!')
    }

    const elevator = new Elevator({
      elevatorCoordinates: new ElevatorCoordinates({
        topX: elevatorCoordinatesTopX,
        topY: elevatorCoordinatesTopY,
        bottonX: elevatorCoordinatesBottomX,
        bottonY: elevatorCoordinatesBottomY}),
      elevatorBrand: new ElevatorBrand({brand: elevatorBrand}),
      elevatorIdentificationNumber: new ElevatorIdentificationNumber({idNumber: elevatorIdentificationNumber}),
      elevatorDescription: new ElevatorDescription({description: elevatorDescription}),
      elevatorModel: new ElevatorModel({model: elevatorModel}),
      elevatorSerialNumber: new ElevatorSerialNumber({serialNumber: elevatorSerialNumber})
      }, new ElevatorID(elevatorId))

    return Result.ok<Elevator>(elevator)
  }
}

function checkBrand(brand: string): boolean{
  let strRegex = new RegExp(/^[a-z0-9 ]+$/i);
  if (brand.length > 50 || !strRegex.test(brand)) return false

  return true
}

function checkIdentificationNumber(idNumber: number): boolean{
  if (!!idNumber === false || idNumber < 0) return false

  return true
}

function checkDescription(description: string): boolean{
  let strRegex = new RegExp(/^[a-z0-9 ]+$/i);
  if (description.length > 250 || !strRegex.test(description)) return false

  return true
}

function checkModel(model: string): boolean{
  let strRegex = new RegExp(/^[a-z0-9 ]+$/i);
  if (model.length > 50 || !strRegex.test(model)) return false

  return true
}

function checkSerialNumber(serialNumber: string): boolean{
  let strRegex = new RegExp(/^[a-z0-9]+$/i);
  if (serialNumber.length > 50 || !strRegex.test(serialNumber)) return false

  return true
}