import { Request, Response, NextFunction } from "express";
import IDeletePassagewayController from "../../IControllers/passageway/delete/IDeletePassagewayController";
import { Inject, Service } from "typedi";
import config from "../../../../config";
import IDeletePassagewayService from "../../../services/IServices/passageway/delete/IDeletePassagewayService";

@Service()
export default class DeletePassagewayController implements IDeletePassagewayController {

    constructor(
        @Inject(config.services.deletePassageway.name) private deletePassagewayService: IDeletePassagewayService
    ) { }

    public async deletePassageway(req: Request, res: Response, next: NextFunction) {
        try {
            const id = req.params.id

            const result = await this.deletePassagewayService.deletePassageway(parseInt(id))

            if (result.isFailure) {
                res.status(400).send(result.errorValue());
            }

            res.status(200).json(result.getValue());

        } catch (error) {
            res.status(500).send('Internal Server Error');
        }
    }
}