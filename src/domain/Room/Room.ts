import { AggregateRoot } from '../../core/domain/AggregateRoot';
import { UniqueEntityID } from '../../core/domain/UniqueEntityID';
import { Guard } from '../../core/logic/Guard';
import { Result } from '../../core/logic/Result';
import { RoomCategory } from './RoomCategory';
import { RoomDescription } from './RoomDescription';
import { RoomName } from './RoomName';

interface RoomProps {
  roomDescription: RoomDescription;
  roomCategory: RoomCategory;
}

export class Room extends AggregateRoot<RoomProps> {
  get id (): UniqueEntityID {
    return this._id
  }

  get description (): RoomDescription {
    return this.props.roomDescription
  }

  get category (): RoomCategory {
    return this.props.roomCategory
  }

  set description (value : RoomDescription) {
    this.props.roomDescription = value
  }
  
  set category (value : RoomCategory) {
    this.props.roomCategory = value
  }

  constructor(props: RoomProps, id: RoomName) {
    super(props, id);
  }

  public static create(props: RoomProps, name: RoomName): Result<Room> {
    
    const guardedProps = [
      {argument: name, argumentName: 'roomName'},
      {argument: props.roomDescription, argumentName: 'roomDescription'},
      {argument: props.roomCategory, argumentName: 'roomCategory'}
    ]
    
    const guardResult = Guard.againstNullOrUndefinedBulk(guardedProps)

    if (!guardResult.succeeded) {
      return Result.fail<Room>(guardResult.message)
    }     
    else {
      const room = new Room({
        ...props
      }, name);

      return Result.ok<Room>(room);
    }
  }
}
