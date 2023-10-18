import { initial } from 'lodash';
import { ValueObject } from '../../core/domain/ValueObject';

  
  interface OperationStatusProps {
    status: boolean;
  }

  export class OperationStatus extends ValueObject<OperationStatusProps> {

    private constructor (props : OperationStatusProps){
      super(props);
    }
    
  }
