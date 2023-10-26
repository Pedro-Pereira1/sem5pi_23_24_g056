import { AggregateRoot } from '../../core/domain/AggregateRoot';
import { Result } from '../../core/logic/Result';
import IRoomDTO from '../../dto/room/IRoomDTO';
import { RoomCoordinates } from './RoomCoordinates';
import { RoomID } from './RoomID';

interface RoomProps {
  roomCoordinates: RoomCoordinates;
}

export class Room extends AggregateRoot<RoomProps> {

  constructor(props: RoomProps, roomId: RoomID) {
    super(props, roomId);
  }

  public static create(roomDto: IRoomDTO): Result<Room> {
    const roomId: number = roomDto.roomId
    const roomCoordinatesTopX: number = roomDto.x
    const roomCoordinatesTopY: number = roomDto.y

    //TODO
    if (false) {
      return Result.fail<Room>('error')
    }

    const room = new Room({
      roomCoordinates: new RoomCoordinates({
        x: roomCoordinatesTopX,
        y: roomCoordinatesTopY,
      })
    }, new RoomID(roomId))
  
    return Result.ok<Room>(room)
  }
}
