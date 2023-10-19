import { AggregateRoot } from '../../core/domain/AggregateRoot';
import { UniqueEntityID } from "../../core/domain/UniqueEntityID";
import { RobotBrand } from './RobotBrand';
import { RobotModel } from './RobotModel';
import { RobotTypeID } from './RobotTypeID';
import { AvailableTask } from './AvailableTask';

  interface robotTypeProps {
    robotBrand: RobotBrand;
    robotModel: RobotModel;
    robotTypeID: RobotTypeID;
    availableTasks: AvailableTask[];
  }

  export class RobotType extends AggregateRoot<robotTypeProps> {

    
    private constructor (props: robotTypeProps, id?: UniqueEntityID) {
      super(props, id);
    }

  }
