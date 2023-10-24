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
    const roomCoordinatesTopX: number = roomDto.roomCoordinatesTopX
    const roomCoordinatesTopY: number = roomDto.roomCoordinatesTopY
    const roomCoordinatesBottomX: number = roomDto.roomCoordinatesBottomX
    const roomCoordinatesBottomY: number = roomDto.roomCoordinatesBottomY

    //TODO
    if (false) {
      return Result.fail<Room>('error')
    }

    const room = new Room({
      roomCoordinates: new RoomCoordinates({
        topX: roomCoordinatesTopX,
        topY: roomCoordinatesTopY,
        bottonX: roomCoordinatesBottomX,
        bottonY: roomCoordinatesBottomY
      })
    }, new RoomID(roomId))
  
    return Result.ok<Room>(room)
  }
}
