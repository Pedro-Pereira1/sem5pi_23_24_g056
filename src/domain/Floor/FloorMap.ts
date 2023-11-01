import { Passageway } from '../Passageway/Passageway';
import { Room } from '../Room/Room';
import { Elevator } from '../Elevator/Elevator';
import IdCoords from './IdCoords';
import { Entity } from '../../core/domain/Entity';

interface FloorMapProps {
  map: number[][]
  passageways: Passageway[]
  rooms: Room[]
  elevators: Elevator[]
  passagewaysCoords: IdCoords[]
  elevatorsCoords: IdCoords[]
  roomsCoords: IdCoords[]
}

export class FloorMap extends Entity<FloorMapProps> {

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

  loadFloorMap(layout: number[][]) {
    this.props.map = layout
  }

  get passagewaysId(): number[] {
    let ids: number[] = []
    this.props.passageways.forEach(m => {
      ids.push(Number(m.id.toValue()))
    })
    return ids
  }

  get passagewaysCoords(): number[][] {
    let coords: number[][] = []

    for(let i = 0; i < this.props.passagewaysCoords.length; i++) {
      coords[i][0] = this.props.passagewaysCoords[i].x
      coords[i][1] = this.props.passagewaysCoords[i].y
    }

    return coords
  }

  get elevatorsId(): number[] {
    let ids: number[] = []
    this.props.elevators.forEach(m => {
      ids.push(Number(m.id.toValue()))
    })
    return ids
  }

  get elevatorsCoords(): number[][] {
    let coords: number[][] = []

    for(let i = 0; i < this.props.passagewaysCoords.length; i++) {
      coords[i][0] = this.props.elevatorsCoords[i].x
      coords[i][1] = this.props.elevatorsCoords[i].y
    }

    return coords
  }

  get roomsId(): string[] {
    let ids: string[] = []
    this.props.rooms.forEach(m => {
      ids.push((m.id.toString()))
    })
    return ids
  }

  get roomsCoords(): number[][] {
    let coords: number[][] = []

    for(let i = 0; i < this.props.passagewaysCoords.length; i++) {
      coords[i][0] = this.props.roomsCoords[i].x
      coords[i][1] = this.props.roomsCoords[i].y
    }

    return coords
  }

  get map(): number[][] {
    return this.props.map
  }
}
