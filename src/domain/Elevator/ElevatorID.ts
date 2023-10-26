import { Entity } from "../../core/domain/Entity";
import { UniqueEntityID } from "../../core/domain/UniqueEntityID";

export class ElevatorID extends Entity<any> {
  get id (): UniqueEntityID {
    return this._id;
  }

  constructor (id?: UniqueEntityID) {
    super(null, id)
  }
}