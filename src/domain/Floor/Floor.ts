import { AggregateRoot } from '../../core/domain/AggregateRoot';
import { UniqueEntityID } from "../../core/domain/UniqueEntityID";
import { FloorDescription } from './FloorDescription';
import FloorId from './FloorId';
import { FloorMap } from './FloorMap';
import { IFloorDTO } from '../../dto/floor/IFloorDTO'
import { Result } from '../../core/logic/Result';
import { Passageway } from '../Passageway/Passageway';

interface FloorProps {
  floorDescription: FloorDescription
  floorNumber: number
  floormap: FloorMap
}

export class Floor extends AggregateRoot<FloorProps> {

  private constructor(props: FloorProps, floorNumber: FloorId) {
    super(props, floorNumber);
  }

  get number(): FloorId {
    return this.id
  }

  get description(): FloorDescription {
    return this.props.floorDescription
  }

  get map(): FloorMap {
    return this.props.floormap
  }

  public static create(floorProp: FloorProps, floorId: number): Result<Floor> {

    //TODO vericications
    if (false) {
      return Result.fail<Floor>('error')
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
}
