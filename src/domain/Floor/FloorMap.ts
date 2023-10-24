import { AggregateRoot } from '../../core/domain/AggregateRoot';
import { Passageway } from '../Passageway/Passageway';
import { Room } from '../Room/Room';
import { Elevator } from '../Elevator/Elevator';

interface FloorMapProps {
  map: String[][]
  passageways: Passageway[]
  rooms: Room[]
  elevators: Elevator[]
}

export class FloorMap extends AggregateRoot<FloorMapProps> {

  constructor(props: FloorMapProps) {
    super(props);
  }

}
