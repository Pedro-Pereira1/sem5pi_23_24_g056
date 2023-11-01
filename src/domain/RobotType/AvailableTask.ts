import { initial } from 'lodash';
import { ValueObject } from '../../core/domain/ValueObject';
import { Result } from '../../core/logic/Result';

  
  interface AvailableTaskProps {
    Type: string;
  }

  export class AvailableTask extends ValueObject<AvailableTaskProps> {

    private constructor (props : AvailableTaskProps){
      super(props);
    }

    public static createList (tasks: string[]): Result<AvailableTask[]> {
      let availableTasks: AvailableTask[] = [];

      if(tasks.length === 0){
        return Result.fail<AvailableTask[]>("No tasks")
      }

      for(let i = 0; i < tasks.length; i++){
        const task = tasks[i];
        const availableTaskOrError = AvailableTask.create({Type: task})
        if (availableTaskOrError.isFailure) {
          return Result.fail<AvailableTask[]>("Task not available")
        }
        
        for(let j = 0; j < i; j++){
          if(availableTasks[j].props.Type === availableTaskOrError.getValue().props.Type){
            return Result.fail<AvailableTask[]>("Duplicate task")
          }
        }

        availableTasks.push(availableTaskOrError.getValue())
      }

      return Result.ok<AvailableTask[]>(availableTasks)
    }

    public static create (props: AvailableTaskProps): Result<AvailableTask> {
      if (props.Type === "Floor surveillance" || props.Type === "Object transport") {
        return Result.ok<AvailableTask>(new AvailableTask(props))
      } else {
        return Result.fail<AvailableTask>("Task not available")
      }
    }
    
  }
