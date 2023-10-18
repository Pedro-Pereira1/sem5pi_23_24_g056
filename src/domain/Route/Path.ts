import { initial } from 'lodash';
import { ValueObject } from '../../core/domain/ValueObject';

  
  interface PathProps {
    description: string;
  }

  export class Path extends ValueObject<PathProps> {

    private constructor (props : PathProps){
      super(props);
    }
    
  }
