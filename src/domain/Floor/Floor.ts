import { AggregateRoot } from '../../core/domain/AggregateRoot';
import { FloorDescription } from './FloorDescription';
import FloorId from './FloorId';
import { FloorMap } from './FloorMap';
import { Result } from '../../core/logic/Result';
import { Passageway } from '../Passageway/Passageway';
import { Room } from '../Room/Room';
import { Elevator } from '../Elevator/Elevator';
import FloorNumber from './FloorNumber';

interface FloorProps {
  floorDescription: FloorDescription
  floorNumber: number
  floormap: FloorMap
}

export class Floor extends AggregateRoot<FloorProps> {

  private constructor(props: FloorProps, floorNumber: FloorId) {
    super(props, floorNumber);
  }

  get floorId(): FloorId {
    return this.id
  }

  get description(): FloorDescription {
    return this.props.floorDescription
  }

  get map(): FloorMap {
    return this.props.floormap
  }

  loadFloorMapAndUpdate(layout: number[][]) {
    this.props.floormap.loadFloorMap(layout)
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
      })
    }, new FloorId(floorId))

    return Result.ok<Floor>(floor)
  }


  addPassageway(passageway: Passageway) {
    this.map.addPassageway(passageway)
  }

  addelevators(elevator: Elevator) {
    this.map.addelevators(elevator)
  }

  addRoom(room: Room) {
    this.map.addRoom(room)
  }

}
