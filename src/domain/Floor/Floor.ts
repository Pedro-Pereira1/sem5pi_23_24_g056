import { AggregateRoot } from '../../core/domain/AggregateRoot';
import { FloorDescription } from './FloorDescription';
import FloorId from './FloorId';
import { FloorMap } from './FloorMap';
import { Result } from '../../core/logic/Result';
import { Passageway } from '../Passageway/Passageway';
import { Room } from '../Room/Room';
import { Elevator } from '../Elevator/Elevator';
import FloorNumber from './FloorNumber';
import DoubleCoords from './DoubleCoords';
import SingleCoords from './SingleCoords';

interface FloorProps {
  floorDescription: FloorDescription
  floorNumber: FloorNumber
  floormap: FloorMap
}

export class Floor extends AggregateRoot<FloorProps> {

  private constructor(props: FloorProps, floorNumber: FloorId) {
    super(props, floorNumber);
  }

  get floorId(): FloorId {
    return this.id
  }

  get floorNumber(): FloorNumber {
    return this.props.floorNumber
  }

  get description(): FloorDescription {
    return this.props.floorDescription
  }

  get map(): FloorMap {
    return this.props.floormap
  }

  loadFloorMapAndUpdate(layout: number[][], passageways: DoubleCoords[], elevators: SingleCoords[], rooms: DoubleCoords[]) {
    this.map.loadFloorMap(layout)
    this.map.updateFloorObjectsCoordinates(passageways, elevators, rooms)
  }

  public static create(floorProp: FloorProps, floorId: number): Result<Floor> {

    if (floorId < 0 || floorProp.floorDescription.description.length > 250) {
      return Result.fail<Floor>('Invalid floor')
    }

    const floor = new Floor({
      floorDescription: floorProp.floorDescription,
      floorNumber: floorProp.floorNumber,
      floormap: new FloorMap({
        map: floorProp.floormap.props.map,
        passageways: floorProp.floormap.props.passageways,
        rooms: floorProp.floormap.props.rooms,
        elevators: floorProp.floormap.props.elevators,
        passagewaysCoords: floorProp.floormap.props.passagewaysCoords,
        elevatorsCoords: floorProp.floormap.props.elevatorsCoords,
        roomsCoords: floorProp.floormap.props.roomsCoords
      })
    }, new FloorId(floorId))

    return Result.ok<Floor>(floor)
  }


  addPassageway(passageway: Passageway) {
    this.map.addPassageway(passageway)
  }

  removePassageway(passageway: Passageway) {
    this.map.removePassageway(passageway)
  }

  addElevators(elevator: Elevator) {
    if (this.props.floormap.props.elevators.includes(elevator)) throw new Error("Floor with Number" + this.props.floorNumber + "already has this elevator!")
    this.map.addElevators(elevator)
  }

  removeElevator(elevator: Elevator) {
    this.map.removeElevator(elevator)
  }

  addRoom(room: Room) {
    this.map.addRoom(room)
  }

}
