import { Identifier } from '../../core/domain/Identifier';
import { UniqueEntityID } from '../../core/domain/UniqueEntityID';
import { ValueObject } from '../../core/domain/ValueObject';
import { Guard } from '../../core/logic/Guard';
import { Result } from '../../core/logic/Result';


export class RoomName extends UniqueEntityID {

  constructor(name: string) {
    super(name);
  }

  public static create (name: string): Result<RoomName> {
    const guardResult = Guard.againstNullOrUndefined(name, 'roomName');
    if (!guardResult.succeeded) {
      return Result.fail<RoomName>(guardResult.message);
    } 
    
    if (name.length === 0 || !!name === false) return Result.fail<RoomName>('Name must be provided!')

    let strRegex = new RegExp(/^[a-z0-9 ]+$/i);
    if (!strRegex.test(name)) return Result.fail<RoomName>('Name must be alphanumeric!')

    if (name.length > 50) return Result.fail<RoomName>('Name must be less than 50 characters!')
    
    return Result.ok<RoomName>(new RoomName(name))
  }
}