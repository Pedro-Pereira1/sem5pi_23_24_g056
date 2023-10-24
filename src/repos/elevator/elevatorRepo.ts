import { Inject, Service } from "typedi";
import IElevatorRepo from "../../services/IRepos/elevator/IElevatorRepo";
import { Elevator } from "../../domain/Elevator/Elevator";
import { Document } from "mongodb";
import { Model } from "mongoose";
import ElevatorMap from "../../mappers/elevator/ElevatorMap";
import IElevatorPersistence from "../../dataschema/elevator/IElevatorPersistence";

@Service()
export default class ElevatorRepo implements IElevatorRepo {

    constructor(
        @Inject('elevatorSchema') private elevatorSchema: Model<IElevatorPersistence & Document>
    ) {}


    exists(t: Elevator): Promise<boolean> {
        throw new Error("Method not implemented.");
    }

    public async save(elevator: Elevator): Promise<Elevator> {
        const query = { elevatorId: elevator.id.toValue() }

        const elevatorDocument = await this.elevatorSchema.findOne(query)

        try {
            if (elevatorDocument === null) {
                const rawElevator: any = ElevatorMap.toPersistence(elevator)

                const ElevatorCreated = await this.elevatorSchema.create(rawElevator)

                return ElevatorMap.toDomain(ElevatorCreated)

            } else {

                elevatorDocument.elevatorCoordinatesTopX = elevator.props.elevatorCoordinates.props.topX
                elevatorDocument.elevatorCoordinatesTopY = elevator.props.elevatorCoordinates.props.topY
                elevatorDocument.elevatorCoordinatesBottomX = elevator.props.elevatorCoordinates.props.bottonX
                elevatorDocument.elevatorCoordinatesBottomY = elevator.props.elevatorCoordinates.props.bottonY

                await elevatorDocument.save()

                return elevator
            }

        } catch (err) {
            throw err
        }
    }

    findById(id: number): Elevator {
        throw new Error("Method not implemented.");
    }


}