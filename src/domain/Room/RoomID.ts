import { ValueObject } from '../../core/domain/ValueObject';
import { UniqueEntityID } from "../../core/domain/UniqueEntityID";

export class RoomID extends UniqueEntityID {

  constructor(id: number){
    super(id)
  }

}