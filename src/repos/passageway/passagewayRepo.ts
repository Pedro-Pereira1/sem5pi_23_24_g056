import { Inject, Service } from "typedi";
import IPassagewayRepo from "../../services/IRepos/passageway/IPassagewayRepo";
import { Passageway } from "../../domain/Passageway/Passageway";
import IPassagewayPersistence from "../../dataschema/passageway/IPassagewayPersistence";
import { Document, FilterQuery, Model } from 'mongoose';
import { PassagewayMap } from "../../mappers/passageway/PassagewayMap";
import { PassagewayID } from "../../domain/Passageway/PassagewayID";

@Service()
export default class PassagewayRepo implements IPassagewayRepo {

    constructor(
        @Inject('passagewaySchema') private passagewaychema: Model<IPassagewayPersistence & Document>
    )
    {}

    async exists(passageway: Passageway): Promise<boolean> {
        const idX = passageway.id instanceof PassagewayID ? (<PassagewayID>passageway.id).toValue() : passageway.id;
    
        const query = { domainId: idX };
        const passagewayDocument = await this.passagewaychema.findOne(query as FilterQuery<IPassagewayPersistence & Document>);
    
        return !!passagewayDocument;
      }




    public async  save(passageway: Passageway): Promise<Passageway> {
        const query = { PassagewayID: passageway.id.toString()}; 
    
        const passagewayDocument = await this.passagewaychema.findOne( query );
    
        try {
          if (passagewayDocument === null ) {
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
        const query = { domainId: PassagewayID};
        const passagewayRecord = await this.passagewaychema.findOne( query as FilterQuery<IPassagewayPersistence & Document> );
    
        if( passagewayRecord != null) {
          return PassagewayMap.toDomain(passagewayRecord);
        }
        else
          return null;
      }
}