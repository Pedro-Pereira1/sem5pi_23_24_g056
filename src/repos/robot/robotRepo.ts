import { Inject, Service } from "typedi";
import { Document, FilterQuery, Model } from 'mongoose';
import { Robot } from "../../domain/Robot/Robot";
import IRobotRepo from "../../services/IRepos/robot/IRobotRepo";
import IRobotPersistence from "../../dataschema/robot/IRobotPersistence";
import { RobotMap } from "../../mappers/robot/RobotMap";


@Service()
export default class RobotRepo implements IRobotRepo {

  constructor(
    @Inject('robotSchema') private robotSchema: Model<IRobotPersistence & Document>
  ) { }

  async exists(robot: Robot): Promise<boolean> {
    const query = { code: robot.id.toString() };
    const robotRecord = await this.robotSchema.findOne(query as FilterQuery<IRobotPersistence & Document>);
    if (robotRecord != null) {
      return true;
    }
    else
      return false;
  }

  public async save(robot: Robot): Promise<Robot> {
    
    const query = { code: robot.id };
    const robotDocument = await this.robotSchema.findOne(query);

    try {
      if (robotDocument === null) {
        const rawRobot: any = RobotMap.toPersistence(robot);
        const robotCreated = await this.robotSchema.create(rawRobot);
        return RobotMap.toDomain(robotCreated);
        
      } else {
        //TO-D0: Update

        

        await robotDocument.save();
        return robot;
     }
    } catch (err) {
      throw err;
    }
  }

  public async findById(id: string): Promise<Robot> {
    const query = { code: id };
    const robotRecord = await this.robotSchema.findOne(query as FilterQuery<IRobotPersistence & Document>);
    if (robotRecord != null) {
      return RobotMap.toDomain(robotRecord);
    }
    else
      return null;
  }

  public async findBySerialNumberAndType(serialNumber: string, type: string): Promise<boolean> {
    const query = {
        serialNumber: serialNumber,
        type: type,
      };
      
      const robotDocument = await this.robotSchema.findOne(query as FilterQuery<IRobotPersistence & Document>);
       
        if (robotDocument) {
            return true
        } else {
            return false;
        }
    }

}