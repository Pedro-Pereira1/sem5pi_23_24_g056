import { UniqueEntityID } from "../../core/domain/UniqueEntityID";

export default class FloorID extends UniqueEntityID {

  constructor(number: number) {
    super(number)
  }

}