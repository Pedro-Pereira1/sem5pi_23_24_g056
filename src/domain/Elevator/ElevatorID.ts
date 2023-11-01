import { UniqueEntityID } from "../../core/domain/UniqueEntityID";
import { Guard } from "../../core/logic/Guard";
import { Result } from "../../core/logic/Result";

export class ElevatorID extends UniqueEntityID {
  constructor(value: number) {
    super(value)
  }

  get id(): string {
    return this.id
  }

  public static create (id: number): Result<ElevatorID> {
    const guardResult = Guard.againstNullOrUndefined(id, 'elevatorId');
    if (!guardResult.succeeded) {
      return Result.fail<ElevatorID>(guardResult.message);
    } 
    
    if (id < 1) return Result.fail<ElevatorID>('Id must be bigger than zero!')
    
    return Result.ok<ElevatorID>(new ElevatorID(id))
  }
}