import { Inject, Service } from "typedi";
import IElevatorRepo from "../../services/IRepos/elevator/IElevatorRepo";
import { Elevator } from "../../domain/Elevator/Elevator";
import { Document, FilterQuery } from "mongoose";
import { Model } from "mongoose";
import ElevatorMap from "../../mappers/elevator/ElevatorMap";
import IElevatorPersistence from "../../dataschema/elevator/IElevatorPersistence";
import BuildingCode from "../../domain/Building/BuildingCode";

@Service()
export default class ElevatorRepo implements IElevatorRepo {

    constructor(
        @Inject('elevatorSchema') private elevatorSchema: Model<IElevatorPersistence & Document>
    ) {}


    public async exists(elevator: Elevator): Promise<boolean> {
        const query = { elevatorId: elevator.id.toValue() };
        const elevatorRecord = await this.elevatorSchema.findOne(query as FilterQuery<IElevatorPersistence & Document>);
        if (elevatorRecord != null) {
            return true;
        }
        else
            return false;
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
                if (elevator.props.elevatorBrand !== undefined) elevatorDocument.elevatorBrand = elevator.props.elevatorBrand.brand;
                if (elevator.props.elevatorDescription !== undefined) elevatorDocument.elevatorDescription = elevator.props.elevatorDescription.description;
                if (elevator.props.elevatorModel !== undefined) elevatorDocument.elevatorModel = elevator.props.elevatorModel.model;
                if (elevator.props.elevatorSerialNumber !== undefined) elevatorDocument.elevatorSerialNumber = elevator.props.elevatorSerialNumber.serialNumber;
                
                await elevatorDocument.save()

                return elevator
            }

        } catch (err) {
            throw err
        }
    }

    public async findById(id: number): Promise<Elevator> {
        const query = { elevatorId: id };
        const elevatorRecord = await this.elevatorSchema.findOne(query as FilterQuery<IElevatorPersistence & Document>);

        if (elevatorRecord != null) {
            return ElevatorMap.toDomain(elevatorRecord);
        }
        else
            return null;
    }
}