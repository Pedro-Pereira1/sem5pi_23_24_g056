import { initial } from 'lodash';
import { ValueObject } from '../../core/domain/ValueObject';

  
  interface ElevatorCoordinatesProps {
    topX: number;
    topY: number;
    bottonX: number;
    bottonY: number;
  }

  export class ElevatorCoordinates extends ValueObject<ElevatorCoordinatesProps> {

    private constructor (props : ElevatorCoordinatesProps){
      super(props);
    }
    
  }