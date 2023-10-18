import { initial } from 'lodash';
import { ValueObject } from '../../core/domain/ValueObject';

  
  interface RobotBrandProps {
    description: string;
  }

  export class RobotBrand extends ValueObject<RobotBrandProps> {

    private constructor (props : RobotBrandProps){
      super(props);
    }
    
  }
