import {Inject, Service} from "typedi";
import config from "../../../../config";
import {NextFunction, Request, Response} from "express";
import IListFloorsPassagewaysController from "../../IControllers/floor/list/IListFloorsPassagewaysController";
import IListFloorsPassagewaysService from "../../../services/IServices/floor/list/IListFloorsPassagewaysService";

@Service()
export default class ListFloorsPassagewaysController implements IListFloorsPassagewaysController{

    constructor(
        @Inject(config.services.listFloorsPassageways.name) private listFloorsPassagewaysService: IListFloorsPassagewaysService
    )
    {}

    public async listFloorsPassageways(req: Request, res: Response, next: NextFunction) {
        try {
            const buildingCode = req.params.buildingCode.toString();
            const floorsOrError = await this.listFloorsPassagewaysService.listFloorsPassageways(buildingCode)

            if(floorsOrError.isFailure) {
                return res.status(400).send(floorsOrError.errorValue())
            }

            return res.status(200).json(floorsOrError.getValue())
        } catch(e) {
            throw e
        }
    }


}