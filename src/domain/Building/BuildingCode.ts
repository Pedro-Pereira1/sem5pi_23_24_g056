import { UniqueEntityID } from "../../core/domain/UniqueEntityID";

export default class BuildingCode extends UniqueEntityID {

    constructor(code: string) {
        super(code)
    }
}