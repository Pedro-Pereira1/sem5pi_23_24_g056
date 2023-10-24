import { UniqueEntityID } from "../../core/domain/UniqueEntityID";

export class ElevatorID extends UniqueEntityID {

  constructor(id: number) {
    super(id)
  }

}