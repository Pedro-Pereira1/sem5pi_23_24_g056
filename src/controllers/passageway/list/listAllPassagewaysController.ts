import {Inject, Service} from "typedi";
import config from "../../../../config";
import {NextFunction, Request, Response} from "express";
import IListAllPassagewaysController from "../../IControllers/passageway/list/IListAllPassagewaysController";
import IListAllPassagewaysService from "../../../services/IServices/passageway/list/IListAllPassagewaysService";

@Service()
export default class ListAllPassagewaysController implements IListAllPassagewaysController{

    constructor(
        @Inject(config.services.listAllPassageways.name) private listAllPassagewaysService: IListAllPassagewaysService
    )
    {}

    public async listAllPassageways(req: Request, res: Response, next: NextFunction) {
        try {
            const passageways = await this.listAllPassagewaysService.listAllPassageways()

            if(passageways.isFailure) {
                return res.status(400).send()
            }

            return res.status(200).json(passageways.getValue())
        } catch(err) {
            throw err
        }
    }


}