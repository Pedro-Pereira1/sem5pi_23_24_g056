import { initial } from 'lodash';
import { ValueObject } from '../../core/domain/ValueObject';

  
  interface SerialNumberProps {
    serialNumberProps: number;
  }

  export class SerialNumber extends ValueObject<SerialNumberProps> {

    private constructor (props : SerialNumberProps){
      super(props);
    }
    
  }
