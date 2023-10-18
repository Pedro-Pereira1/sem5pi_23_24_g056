import { initial } from 'lodash';
import { ValueObject } from '../../core/domain/ValueObject';

  
  interface TaskDescriptionProps {
    description: string;
  }

  export class TaskDescription extends ValueObject<TaskDescriptionProps> {

    private constructor (props : TaskDescriptionProps){
      super(props);
    }
    
  }
