import { Document, Model } from "mongoose";
import { Mapper } from "../../core/infra/Mapper";
import Container from "typedi";
import config from "../../../config";
import { RobotType } from "../../domain/RobotType/RobotType";
import { IRobotTypeDTO } from "../../dto/robotType/IRobotTypeDTO";
import IRobotTypePersistence from "../../dataschema/robotType/IRobotTypePersistence";
import { RobotModel } from "../../domain/RobotType/RobotModel";
import { RobotBrand } from "../../domain/RobotType/RobotBrand";
import { AvailableTask } from "../../domain/RobotType/AvailableTask";


export class RobotTypeMap extends Mapper<RobotType> {

    public static toDto(robotType: RobotType): IRobotTypeDTO {
        return {
            robotTypeID: robotType.id.toValue(),
            robotBrand: robotType.props.robotBrand.brand,
            robotModel: robotType.props.robotModel.model,
            availableTasks: robotType.props.availableTasks.map(task => task.props.Type)
        } as IRobotTypeDTO
    }

    public static async toDomain(robotTypeDTO: any | Model<IRobotTypePersistence & Document>): Promise<RobotType> {

        const brandOrError = RobotBrand.create({ description: robotTypeDTO.robotBrand })
        const modelOrError = RobotModel.create({ description: robotTypeDTO.robotModel })
        const availableTasksOrError = AvailableTask.createList(robotTypeDTO.availableTasks)
        
        const RobotTypeOrError = RobotType.create(
            {
                robotBrand: brandOrError.getValue(),
                robotModel: modelOrError.getValue() ,
                availableTasks: availableTasksOrError.getValue()
            }, robotTypeDTO.robotTypeID)


        return RobotTypeOrError.isSuccess ? RobotTypeOrError.getValue() : null
    }

    public static toPersistence(robotType: RobotType): any {
        return {
            robotTypeID: robotType.id.toValue(),
            robotBrand: robotType.props.robotBrand.brand,
            robotModel: robotType.props.robotModel.model,
            availableTasks: robotType.props.availableTasks.map(task => task.props.Type)
        } as IRobotTypeDTO
    }
}
