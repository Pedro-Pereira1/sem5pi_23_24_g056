import { initial } from 'lodash';
import { ValueObject } from '../../core/domain/ValueObject';

  
  interface TaskTypeProps {
    Type: string;
  }

  export class TaskType extends ValueObject<TaskTypeProps> {

    private constructor (props : TaskTypeProps){
      super(props);
    }
    
  }
