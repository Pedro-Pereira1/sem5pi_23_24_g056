import { UniqueEntityID } from "../../core/domain/UniqueEntityID";

export class BuildingName extends UniqueEntityID {

  constructor(name: string) {
    super(name)
  }

}