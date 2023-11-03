import { AggregateRoot } from '../../core/domain/AggregateRoot';
import { UniqueEntityID } from "../../core/domain/UniqueEntityID";
import { RobotBrand } from './RobotBrand';
import { RobotModel } from './RobotModel';
import { RobotTypeID } from './RobotTypeID';
import { AvailableTask } from './AvailableTask';
import { Result } from '../../core/logic/Result';
import { ICreateRobotTypeDTO } from '../../dto/robotType/ICreateRobotTypeDTO';

  interface robotTypeProps {
    robotBrand: RobotBrand;
    robotModel: RobotModel;
    availableTasks: AvailableTask[];
  }

  export class RobotType extends AggregateRoot<robotTypeProps> {


    private constructor (robotTypeID: RobotTypeID, props: robotTypeProps) {
      super(props, robotTypeID);
    }

    public static create(robotTypeDTO: ICreateRobotTypeDTO, robotTypeID: string): Result<RobotType> {

      const robotBrandOrError=  RobotBrand.create({ description:robotTypeDTO.robotBrand})
            if(robotBrandOrError.isFailure){
                return Result.fail<RobotType>(robotBrandOrError.errorValue())
            }

            const robotModelOrError=  RobotModel.create({ description:robotTypeDTO.robotModel})
            if(robotModelOrError.isFailure){
                return Result.fail<RobotType>(robotModelOrError.errorValue())
            }

            const availableTasksOrError=  AvailableTask.createList(robotTypeDTO.availableTasks)
            if(availableTasksOrError.isFailure){
                return Result.fail<RobotType>(availableTasksOrError.errorValue())
            }

            const robotBrand = robotBrandOrError.getValue();
            const robotModel = robotModelOrError.getValue();
            const availableTasks = availableTasksOrError.getValue();

      const robotType = new RobotType(new RobotTypeID(robotTypeID),
        {
          robotBrand: robotBrand,
          robotModel: robotModel,
          availableTasks: availableTasks
        })

      return Result.ok<RobotType>(robotType)
    }

  }
