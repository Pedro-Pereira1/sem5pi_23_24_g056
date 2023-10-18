import { initial } from 'lodash';
import { ValueObject } from '../../core/domain/ValueObject';

  
  interface RobotModelProps {
    description: string;
  }

  export class RobotModel extends ValueObject<RobotModelProps> {

    private constructor (props : RobotModelProps){
      super(props);
    }
    
  }
