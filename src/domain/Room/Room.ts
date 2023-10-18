import { AggregateRoot } from '../../core/domain/AggregateRoot';
import { UniqueEntityID } from "../../core/domain/UniqueEntityID";
import { RoomCoordinates } from './RoomCoordinates';
import { RoomID } from './RoomID';

  interface RoomProps {
    roomCoordinates: RoomCoordinates;
    roomID: RoomID;
  }

  export class Room extends AggregateRoot<RoomProps> {

    
    private constructor (props: RoomProps, id?: UniqueEntityID) {
      super(props, id);
    }

  }
