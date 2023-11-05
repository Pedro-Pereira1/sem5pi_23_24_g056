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
import { Code } from "../../domain/Robot/Code";
import IRobotTypeRepo from "../../services/IRepos/robotType/IRobotTypeRepo";


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
        const robotTypeRepo: IRobotTypeRepo = Container.get(config.repos.robotType.name)

        const type = await robotTypeRepo.findById(robotDTO.type)
        const RobotOrError = Robot.create(robotDTO, type, robotDTO.code)

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
