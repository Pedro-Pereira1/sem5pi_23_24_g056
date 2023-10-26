import { initial } from 'lodash';
import { ValueObject } from '../../core/domain/ValueObject';

  
  interface RoomCoordinatesProps {
    x: number;
    y: number;
  }

  export class RoomCoordinates extends ValueObject<RoomCoordinatesProps> {

    constructor (props : RoomCoordinatesProps){
      super(props);
    }
    
  }
