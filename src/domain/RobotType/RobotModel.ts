import { initial } from 'lodash';
import { ValueObject } from '../../core/domain/ValueObject';
import { Result } from '../../core/logic/Result';

  
  interface RobotModelProps {
    description: string;
  }

  export class RobotModel extends ValueObject<RobotModelProps> {

    constructor (props : RobotModelProps){
      super(props);
    }
    
    get model(): string {
      return this.props.description
    }
    
    public static create(robotModel: RobotModelProps): Result<RobotModel> {
      if (robotModel.description.length < 1 || robotModel.description.length > 100) {
        return Result.fail<RobotModel>("Robot Model must be greater than 1 and less than 100 characters")
      } else {
        return Result.ok<RobotModel>(new RobotModel(robotModel))
      }
    }

  }
