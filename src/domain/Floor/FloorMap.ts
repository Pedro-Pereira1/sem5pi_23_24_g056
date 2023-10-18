import { AggregateRoot } from '../../core/domain/AggregateRoot';
import { UniqueEntityID } from "../../core/domain/UniqueEntityID";
import { Passageway } from '../Passageway/Passageway';
import { Room } from '../Room/Room';
import { Elevator } from '../Elevator/Elevator';

  interface FloorMapProps {
    passageways: Passageway[];
    rooms: Room[];
    elevators: Elevator[];
  }

  export class FloorMap extends AggregateRoot<FloorMapProps> {

    private constructor (props: FloorMapProps) {
      super(props);
    }

  }
