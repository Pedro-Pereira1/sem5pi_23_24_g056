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



interface RobotProps {
  nickname: Nickname;
  operationStatus: OperationStatus;
  serialNumber: SerialNumber;
  type: RobotType;
  description: RobotDescription;
}

export class Robot extends AggregateRoot<RobotProps> {


  private constructor(code: Code, props: RobotProps) {
    super(props, code);
  }

  get operationStatus(): OperationStatus {
    return this.props.operationStatus
  }

  inhibit() {
    this.operationStatus.inhibit
  }

  public static create(robotProps: RobotProps, code: string): Result<Robot> {
    const nickname = robotProps.nickname
    const operationStatus = OperationStatus.create().getValue()
    const serialNumber = robotProps.serialNumber
    const type = robotProps.type
    const description = robotProps.description


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
