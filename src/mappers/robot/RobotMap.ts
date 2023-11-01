import { Document, Model } from "mongoose";
import { Mapper } from "../../core/infra/Mapper";
import Container from "typedi";
import config from "../../../config";
import { Robot } from "../../domain/Robot/Robot";
import { IRobotDTO } from "../../dto/robot/IRobotDTO";
import IRobotPersistence from "../../dataschema/robot/IRobotPersistence";
import { OperationStatus } from "../../domain/Robot/OperationStatus";
import { Nickname } from "../../domain/Robot/Nickname";
import { SerialNumber } from "../../domain/Robot/SerialNumber";
import { RobotType } from "../../domain/RobotType/RobotType";
import { RobotDescription } from "../../domain/Robot/RobotDescription";


export class RobotMap extends Mapper<Robot> {

    public static toDto(robot: Robot): IRobotDTO {
        return {
            code: robot.id.toString(),
            nickname: robot.props.nickname.nickname,
            type: robot.props.type.id.toString(),
            serialNumber: robot.props.serialNumber.serialNumber,
            description: robot.props.description.description,
            operationStatus: robot.props.operationStatus.status
        } as IRobotDTO
    }

    public static async toDomain(robotDTO: any | Model<IRobotPersistence & Document>): Promise<Robot> {

        const nicknameOrError = Nickname.create({ nickname: robotDTO.nickname })
        const operationStatusOrError = OperationStatus.create()
        const serialNumberOrError = SerialNumber.create({ serialNumber: robotDTO.serialNumber })
        const typeOrError = robotDTO.type
        const descriptionOrError = RobotDescription.create({ description: robotDTO.description })
        
        const RobotOrError = Robot.create(
            {
                nickname: nicknameOrError.getValue(),
                operationStatus: operationStatusOrError.getValue(),
                serialNumber: serialNumberOrError.getValue(),
                type: typeOrError,
                description: descriptionOrError.getValue()
            }, robotDTO.code)


        return RobotOrError.isSuccess ? RobotOrError.getValue() : null
    }

    public static toPersistence(robot: Robot): any {
        return {
            code: robot.id.toString(),
            nickname: robot.props.nickname.nickname,
            type: robot.props.type.id.toString(),
            serialNumber: robot.props.serialNumber.serialNumber,
            description: robot.props.description.description,
            operationStatus: robot.props.operationStatus.status
        } as IRobotDTO
    }
}
