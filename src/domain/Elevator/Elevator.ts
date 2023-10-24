import { AggregateRoot } from '../../core/domain/AggregateRoot';
import { ElevatorCoordinates } from './ElevatorCoordinates';
import { ElevatorID } from './ElevatorID';
import IElevatorDTO from '../../dto/elevator/IElevatorDTO';
import { Result } from '../../core/logic/Result';

interface ElevatorProps {
  elevatorCoordinates: ElevatorCoordinates;
}

export class Elevator extends AggregateRoot<ElevatorProps> {

  constructor(props: ElevatorProps, elevatorId?: ElevatorID) {
    super(props, elevatorId);
  }

  public static create(elevatorDto: IElevatorDTO): Result<Elevator> {
    const elevatorId = elevatorDto.elevatorId
    const elevatorCoordinatesTopX = elevatorDto.elevatorCoordinatesTopX
    const elevatorCoordinatesTopY = elevatorDto.elevatorCoordinatesTopY
    const elevatorCoordinatesBottomX = elevatorDto.elevatorCoordinatesBottomX
    const elevatorCoordinatesBottomY = elevatorDto.elevatorCoordinatesBottomY

    //TODO
    if (false) {
      return Result.fail<Elevator>('error')
    }

    const elevator = new Elevator({
      elevatorCoordinates: new ElevatorCoordinates({
        topX: elevatorCoordinatesTopX,
        topY: elevatorCoordinatesTopY,
        bottonX: elevatorCoordinatesBottomX,
        bottonY: elevatorCoordinatesBottomY
      })
    }, new ElevatorID(elevatorId))

    return Result.ok<Elevator>(elevator)
  }

}
