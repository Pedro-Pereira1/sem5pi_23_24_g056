import { OperationOptions } from 'mongodb';
import { AggregateRoot } from '../../core/domain/AggregateRoot';
import { UniqueEntityID } from "../../core/domain/UniqueEntityID";
import { Code } from './Code';
import { Nickname } from './Nickname';
import { OperationStatus } from './OperationStatus';
import { SerialNumber } from './SerialNumber';
import { RobotType } from '../RobotType/RobotType';



  interface RobotProps {
    code: Code;
    nickname: Nickname;
    operationStatus: OperationStatus;
    serialNumber: SerialNumber;
    type: RobotType;
  }

  export class Robot extends AggregateRoot<RobotProps> {

    
    private constructor (props: RobotProps, id?: UniqueEntityID) {
      super(props, id);
    }

  }
