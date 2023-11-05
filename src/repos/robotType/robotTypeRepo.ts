import { Inject, Service } from "typedi";
import { Document, FilterQuery, Model } from 'mongoose';
import IFloorRepo from "../../services/IRepos/floor/IFloorRepo";
import IRobotTypePersistence from "../../dataschema/robotType/IRobotTypePersistence";
import { RobotType } from "../../domain/RobotType/RobotType";
import IRobotTypeRepo from "../../services/IRepos/robotType/IRobotTypeRepo";
import { RobotTypeMap } from "../../mappers/robotType/RobotTypeMap";
import { RobotBrand } from "../../domain/RobotType/RobotBrand";

@Service()
export default class RobotTypeRepo implements IRobotTypeRepo {

  constructor(
    @Inject('robotTypeSchema') private robotTypeSchema: Model<IRobotTypePersistence & Document>
  ) { }

  async exists(robotType: RobotType): Promise<boolean> {
    const query = { robotType: robotType.id.toString() };
    const robotTypeRecord = await this.robotTypeSchema.findOne(query as FilterQuery<IRobotTypePersistence & Document>);
    if (robotTypeRecord != null) {
      return true;
    }
    else
      return false;
  }

  public async save(robotType: RobotType): Promise<RobotType> {

    const query = { robotTypeID: robotType.id.toString() };

    const robotTypeDocument = await this.robotTypeSchema.findOne(query);

    try {
      if (robotTypeDocument === null) {
        const rawRobotType: any = RobotTypeMap.toPersistence(robotType);
        const robotTypeCreated = await this.robotTypeSchema.create(rawRobotType);
        return RobotTypeMap.toDomain(robotTypeCreated);

      } else {
        if(robotType.props.robotBrand !== undefined){
          robotTypeDocument.robotBrand = robotType.props.robotBrand.props.description;
        }

        if(robotType.props.robotModel !== undefined){
          robotTypeDocument.robotModel = robotType.props.robotModel.props.description;
        }

        if(robotType.props.availableTasks !== undefined){
          robotTypeDocument.availableTasks = robotType.props.availableTasks.map(task => task.props.Type);
        }


        await robotTypeDocument.save();
        return robotType;
     }
    } catch (err) {
      throw err;
    }
  }

  public async findById(id: string): Promise<RobotType> {
    const query = { robotTypeID: id.toString() };
    const robotTypeRecord = await this.robotTypeSchema.findOne(query as FilterQuery<IRobotTypePersistence & Document>);
    if (robotTypeRecord != null) {
      return RobotTypeMap.toDomain(robotTypeRecord);
    }
    else
      return null;
  }


}
