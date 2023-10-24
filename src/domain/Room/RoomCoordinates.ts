import { initial } from 'lodash';
import { ValueObject } from '../../core/domain/ValueObject';

  
  interface RoomCoordinatesProps {
    topX: number;
    topY: number;
    bottonX: number;
    bottonY: number;
  }

  export class RoomCoordinates extends ValueObject<RoomCoordinatesProps> {

    constructor (props : RoomCoordinatesProps){
      super(props);
    }
    
  }
