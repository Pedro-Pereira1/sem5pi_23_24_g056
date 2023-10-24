import { ValueObject } from '../../core/domain/ValueObject';
import { UniqueEntityID } from "../../core/domain/UniqueEntityID";




export class FloorNumber extends UniqueEntityID {

  constructor(number: number) {
    super(number)
  }


}