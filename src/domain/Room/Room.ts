import { AggregateRoot } from '../../core/domain/AggregateRoot';
import { RoomCoordinates } from './RoomCoordinates';
import { RoomID } from './RoomID';

  interface RoomProps {
    roomCoordinates: RoomCoordinates;
  }

  export class Room extends AggregateRoot<RoomProps> {

    constructor (props: RoomProps, roomId?: RoomID) {
      super(props, roomId);
    }

  }
