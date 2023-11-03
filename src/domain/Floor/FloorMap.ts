import { Passageway } from '../Passageway/Passageway';
import { Room } from '../Room/Room';
import { Elevator } from '../Elevator/Elevator';
import DoubleCoords from './DoubleCoords';
import { Entity } from '../../core/domain/Entity';
import SingleCoords from './SingleCoords';

interface FloorMapProps {
  map: number[][]
  passageways: Passageway[]
  rooms: Room[]
  elevators: Elevator[]
  passagewaysCoords: DoubleCoords[]
  elevatorsCoords: SingleCoords[]
  roomsCoords: DoubleCoords[]
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

  updateFloorObjectsCoordinates(passageways: DoubleCoords[], elevators: SingleCoords[], rooms: DoubleCoords[]) {
    this.props.passagewaysCoords = passageways
    this.props.elevatorsCoords = elevators
    this.props.roomsCoords = rooms
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

    for (let i = 0; i < this.props.passagewaysCoords.length; i++) {
      coords[i] = []
      coords[i][0] = Number(this.props.passagewaysCoords[i].id)
      coords[i][1] = this.props.passagewaysCoords[i].x
      coords[i][2] = this.props.passagewaysCoords[i].y
      coords[i][3] = this.props.passagewaysCoords[i].x1
      coords[i][4] = this.props.passagewaysCoords[i].y1
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

    for (let i = 0; i < this.props.elevators.length; i++) {
      coords[i] = []
      coords[i][0] = Number(this.props.elevatorsCoords[i].id)
      coords[i][1] = this.props.elevatorsCoords[i].x
      coords[i][2] = this.props.elevatorsCoords[i].y
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

  get roomsCoords(): number[][] { //strings
    let coords: number[][] = []

    for (let i = 0; i < this.props.rooms.length; i++) {
      coords[i] = []
      coords[i][0] = Number(this.props.roomsCoords[i].id)
      coords[i][1] = this.props.roomsCoords[i].x
      coords[i][2] = this.props.roomsCoords[i].y
      coords[i][3] = this.props.roomsCoords[i].x1
      coords[i][4] = this.props.roomsCoords[i].y1
    }

    return coords
  }

  get map(): number[][] {
    return this.props.map
  }
}
