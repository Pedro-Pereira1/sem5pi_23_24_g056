import { AggregateRoot } from '../../core/domain/AggregateRoot';
import { Passageway } from '../Passageway/Passageway';
import { Room } from '../Room/Room';
import { Elevator } from '../Elevator/Elevator';

interface FloorMapProps {
  map: number[][]
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

  addElevators(elevator: Elevator) {
    this.props.elevators.push(elevator)
  }

  addRoom(room: Room) {
    this.props.rooms.push(room)
  }

  get passagewaysId(): number[] {
    let ids: number[] = []
    this.props.passageways.forEach(m => {
      ids.push(Number(m.id.toValue()))
    })
    return ids
  }

  get elevatorsId(): number[] {
    let ids: number[] = []
    this.props.elevators.forEach(m => {
      ids.push(Number(m.id.toValue()))
    })
    return ids
  }

  get roomsId(): string[] {
    let ids: string[] = []
    this.props.rooms.forEach(m => {
      ids.push(String(m.id.toValue()))
    })
    return ids
  }
}
