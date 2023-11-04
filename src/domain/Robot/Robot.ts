import { OperationOptions } from 'mongodb';
import { AggregateRoot } from '../../core/domain/AggregateRoot';
import { UniqueEntityID } from "../../core/domain/UniqueEntityID";
import { Code } from './Code';
import { Nickname } from './Nickname';
import { OperationStatus } from './OperationStatus';
import { SerialNumber } from './SerialNumber';
import { RobotType } from '../RobotType/RobotType';
import { Result } from '../../core/logic/Result';
import { RobotDescription } from './RobotDescription';
import { ICreateRobotDTO } from '../../dto/robot/ICreateRobotDTO';
import { IRobotDTO } from '../../dto/robot/IRobotDTO';



  interface RobotProps {
    nickname: Nickname;
    operationStatus: OperationStatus;
    serialNumber: SerialNumber;
    type: RobotType;
    description: RobotDescription;
  }

  export class Robot extends AggregateRoot<RobotProps> {


    private constructor (code: Code,props: RobotProps) {
      super(props, code);
    }

    public static create(robotDTO: ICreateRobotDTO,robotType: RobotType, code: string): Result<Robot> {
      const nicknameOrError = Nickname.create({ nickname: robotDTO.nickname })
      if(nicknameOrError.isFailure){
        return Result.fail<Robot>(nicknameOrError.errorValue())
      }

      const operationStatusOrError = OperationStatus.create()
      if(operationStatusOrError.isFailure){
        return Result.fail<Robot>(operationStatusOrError.errorValue())
      }

      const serialNumberOrError = SerialNumber.create({ serialNumber: robotDTO.serialNumber })
      if(serialNumberOrError.isFailure){
        return Result.fail<Robot>(serialNumberOrError.errorValue())
      }

      let descriptionOrError
      if(robotDTO.description != undefined){
        descriptionOrError = RobotDescription.create({ description: robotDTO.description })
        if(descriptionOrError.isFailure){
            return Result.fail<Robot>(descriptionOrError.errorValue())
        }
      }else{
        descriptionOrError = RobotDescription.create({ description: "" })
      }

      const nickname = nicknameOrError.getValue()
      const operationStatus = operationStatusOrError.getValue()
      const serialNumber = serialNumberOrError.getValue()
      const type = robotType
      const description = descriptionOrError.getValue()

      const robot = new Robot(new Code(code),
        {
          nickname: nickname,
          operationStatus: operationStatus,
          serialNumber: serialNumber,
          type: type,
          description: description
        })
  
      return Result.ok<Robot>(robot)
    }

  }
