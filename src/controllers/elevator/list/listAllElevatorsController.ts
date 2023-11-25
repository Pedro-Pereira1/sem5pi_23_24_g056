import {Inject, Service} from "typedi";
import config from "../../../../config";
import {NextFunction, Request, Response} from "express";
import IListAllElevatorsController from "../../IControllers/elevator/list/IListAllElevatorsController";
import IListAllElevatorsService from "../../../services/IServices/elevator/list/IListAllElevatorsService";

@Service()
export default class ListAllElevatorsController implements IListAllElevatorsController{

    constructor(
        @Inject(config.services.listAllElevators.name) private listAllElevatorsService: IListAllElevatorsService
    )
    {}

    public async listAllElevators(req: Request, res: Response, next: NextFunction) {
        try {
            const passageways = await this.listAllElevatorsService.listAllElevators()

            if(passageways.isFailure) {
                return res.status(400).send()
            }

            return res.status(200).json(passageways.getValue())
        } catch(err) {
            throw err
        }
    }


}