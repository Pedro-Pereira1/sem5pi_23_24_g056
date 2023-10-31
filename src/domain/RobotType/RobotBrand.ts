import { initial } from 'lodash';
import { ValueObject } from '../../core/domain/ValueObject';
import { Result } from '../../core/logic/Result';

  
  interface RobotBrandProps {
    description: string;
  }

  export class RobotBrand extends ValueObject<RobotBrandProps> {

    constructor (props : RobotBrandProps){
      super(props);
    }
    
    get brand(): string {
      return this.props.description
    }

    public static create(robotBrand: RobotBrandProps): Result<RobotBrand> {
      if (robotBrand.description.length < 1 || robotBrand.description.length > 50) {
        return Result.fail<RobotBrand>("Robot Brand must be greater than 1 and less than 50 characters")
      } else {
        return Result.ok<RobotBrand>(new RobotBrand(robotBrand))
      }
    }

  }

  