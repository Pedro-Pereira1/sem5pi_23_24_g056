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

  addPassageway(passageway: Passageway) {
    this.props.passageways.push(passageway)
  }

  addelevators(elevator: Elevator) {
    this.props.elevators.push(elevator)
  }

  addRoom(room: Room) {
    this.props.rooms.push(room)
  }

  get passagewaysId(): string[] {
    let ids: string[] = []
    this.props.passageways.forEach(m => {
      ids.push(m.id.toString())
    })
    return ids
  }

  get elevatorsId(): string[] {
    let ids: string[] = []
    this.props.elevators.forEach(m => {
      ids.push(m.id.toString())
    })
    return ids
  }

  get roomsId(): string[] {
    let ids: string[] = []
    this.props.rooms.forEach(m => {
      ids.push(m.id.toString())
    })
    return ids
  }
}
