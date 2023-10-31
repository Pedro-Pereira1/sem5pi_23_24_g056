import { initial } from 'lodash';
import { ValueObject } from '../../core/domain/ValueObject';
import { Result } from '../../core/logic/Result';

  
  interface RobotDescriptionProps {
    description: string;
  }

  export class RobotDescription extends ValueObject<RobotDescriptionProps> {

    private constructor (props : RobotDescriptionProps){
      super(props);
    }

    public static create (props: RobotDescriptionProps):  Result<RobotDescription> {
        if (props.description.length > 250) {
            return Result.fail<RobotDescription>('Description must be less than 250 characters');
        }

        return Result.ok<RobotDescription>(new RobotDescription({ description: props.description }));
  }    

        get description (): string {
            return this.props.description;
        }
  }
