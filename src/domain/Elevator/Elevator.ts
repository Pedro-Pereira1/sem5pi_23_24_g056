import { AggregateRoot } from '../../core/domain/AggregateRoot';
import { ElevatorCoordinates } from './ElevatorCoordinates';
import { ElevatorID } from './ElevatorID';

interface ElevatorProps {
  elevatorCoordinates: ElevatorCoordinates;
}

export class Elevator extends AggregateRoot<ElevatorProps> {

  constructor(props: ElevatorProps, elevatorId?: ElevatorID) {
    super(props, elevatorId);
  }

}
