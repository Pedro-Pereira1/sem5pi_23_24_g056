import { AggregateRoot } from '../../core/domain/AggregateRoot';
import { UniqueEntityID } from "../../core/domain/UniqueEntityID";
import { ElevatorCoordinates } from './ElevatorCoordinates';
import { ElevatorID } from './ElevatorID';

  interface ElevatorProps {
    elevatorCoordinates: ElevatorCoordinates;
    elevatorID: ElevatorID;
  }

  export class Building extends AggregateRoot<ElevatorProps> {

    
    private constructor (props: ElevatorProps, id?: UniqueEntityID) {
      super(props, id);
    }

  }
