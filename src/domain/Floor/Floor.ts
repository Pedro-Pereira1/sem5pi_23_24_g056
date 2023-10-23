import { AggregateRoot } from '../../core/domain/AggregateRoot';
import { UniqueEntityID } from "../../core/domain/UniqueEntityID";
import { FloorDescription } from './FloorDescription';
import { FloorNumber } from './FloorNumber';
import { FloorMap } from './FloorMap';
import { IFloorDTO } from '../../dto/floor/IFloorDTO'
import { Result } from '../../core/logic/Result';
import { Passageway } from '../Passageway/Passageway';

interface FloorProps {
  floorDescription: FloorDescription
  floormap: FloorMap
}

export class Floor extends AggregateRoot<FloorProps> {

  private constructor(props: FloorProps, floorNumber: FloorNumber) {
    super(props, floorNumber);
  }

  get number(): FloorNumber {
    return this.id
  }

  get description(): FloorDescription {
    return this.props.floorDescription
  }

  get map(): FloorMap {
    return this.props.floormap
  }

  public static create(floorDto: IFloorDTO): Result<Floor> {
    const number = floorDto.floorNumber
    const description = floorDto.floorDescription

    //TODO verifications
    if (false) {
      return Result.fail<Floor>('invalid floor')
    }

    const floor = new Floor({
      floorDescription: new FloorDescription({value: description}),
      floormap: new FloorMap({
        map: [],
        passageways: [],
        rooms: [],
        elevators: [],
      })
    }, new FloorNumber(number))

    return Result.ok<Floor>(floor)
  }
}
