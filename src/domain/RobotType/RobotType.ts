import { AggregateRoot } from '../../core/domain/AggregateRoot';
import { UniqueEntityID } from "../../core/domain/UniqueEntityID";
import { RobotBrand } from './RobotBrand';
import { RobotModel } from './RobotModel';
import { RobotTypeID } from './RobotTypeID';
import { AvailableTask } from './AvailableTask';
import { Result } from '../../core/logic/Result';

  interface robotTypeProps {
    robotBrand: RobotBrand;
    robotModel: RobotModel;
    availableTasks: AvailableTask[];
  }

  export class RobotType extends AggregateRoot<robotTypeProps> {

    
    private constructor (robotTypeID: RobotTypeID, props: robotTypeProps) {
      super(props, robotTypeID);
    }

    public static create(robotTypeProps: robotTypeProps, robotTypeID: string): Result<RobotType> {
      const robotBrand = robotTypeProps.robotBrand
      const robotModel = robotTypeProps.robotModel
      const availableTasks = robotTypeProps.availableTasks

      const robotType = new RobotType(new RobotTypeID(robotTypeID),
        {
          robotBrand: robotBrand,
          robotModel: robotModel,
          availableTasks: availableTasks
        })
  
      return Result.ok<RobotType>(robotType)
    }

  }
