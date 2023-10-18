import { AggregateRoot } from '../../core/domain/AggregateRoot';
import { UniqueEntityID } from "../../core/domain/UniqueEntityID";
import { TaskID } from './TaskID';
import { TaskDescription } from './TaskDescription';
import { TaskType } from './TaskType';

  interface TaskProps {
    taskDescription: TaskDescription;
    taskID: TaskID;
    taskType: TaskType;
  }

  export class Task extends AggregateRoot<TaskProps> {

    
    private constructor (props: TaskProps, id?: UniqueEntityID) {
      super(props, id);
    }

  }
