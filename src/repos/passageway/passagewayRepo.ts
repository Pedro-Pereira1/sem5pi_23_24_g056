import { Inject, Service } from "typedi";
import IPassagewayRepo from "../../services/IRepos/passageway/IPassagewayRepo";
import { Passageway } from "../../domain/Passageway/Passageway";
import IPassagewayPersistence from "../../dataschema/passageway/IPassagewayPersistence";
import { Document, FilterQuery, Model } from 'mongoose';
import { PassagewayMap } from "../../mappers/passageway/PassagewayMap";

@Service()
export default class PassagewayRepo implements IPassagewayRepo {

  constructor(
    @Inject('passagewaySchema') private passagewaychema: Model<IPassagewayPersistence & Document>
  ) { }

  async exists(passageway: Passageway): Promise<boolean> {
    const query = { passagewayId: passageway.id };
    const passagewayRecord = await this.passagewaychema.findOne(query as FilterQuery<IPassagewayPersistence & Document>);

    if (passagewayRecord != null) {
      return true
    } else
      return false;
  }




  public async save(passageway: Passageway): Promise<Passageway> {
    const query = { passagewayId: Number(passageway.id) };

    const passagewayDocument = await this.passagewaychema.findOne(query);

    try {
      if (passagewayDocument === null) {

        const rawPassageway: any = PassagewayMap.toPersistence(passageway);

        const passagewayCreated = await this.passagewaychema.create(rawPassageway);

        return PassagewayMap.toDomain(passagewayCreated);
      } else {
        passagewayDocument.id = passageway.id;
        await passagewayDocument.save();

        return passageway;
      }
    } catch (err) {
      throw err;
    }
  }


  public async findById(number: number): Promise<Passageway> {
    const query = { passagewayId: number };
    const passagewayRecord = await this.passagewaychema.findOne(query as FilterQuery<IPassagewayPersistence & Document>);

    if (passagewayRecord != null) {
      return PassagewayMap.toDomain(passagewayRecord);
    } else
      return null;
  }

  public async deletePassageway(passageway: Passageway): Promise<boolean> {
    try {
      const query = { passagewayId: passageway.id.toValue() };

      const passagewayDocument = await this.passagewaychema.findOne(query as FilterQuery<IPassagewayPersistence & Document>);

      if (passagewayDocument === null) {
        return false
      }

      await passagewayDocument.deleteOne();

      return true

    } catch (e) {
      throw e
    }
  }
}