import { NextFunction, Request, Response } from "express";
import ICreatePassagewayController from "../../IControllers/passageway/create/ICreatePassagewayController";
import { Inject, Service } from "typedi";
import config from "../../../../config";
import ICreatePassagewayService from "../../../services/IServices/passageway/create/ICreatePassagewayService";
import { PassagewayMap } from "../../../mappers/passageway/PassagewayMap";
import { IPassagewayDTO } from "../../../dto/passageway/IPassagewayDTO";
import { Result } from "../../../core/logic/Result";
import { ICreatePassagewayDTO } from "../../../dto/passageway/ICreatePassagewayDTO";

@Service()
export default class CreatePassagewayController implements ICreatePassagewayController {

    constructor(
        @Inject(config.services.createPassageway.name) private service: ICreatePassagewayService
    )
    {}

    public async createPassageway(req: Request, res: Response, next: NextFunction) {
        try {
            const PassagewayOrError = await this.service.createPassageway(req.body as ICreatePassagewayDTO) as Result<IPassagewayDTO>

            if (PassagewayOrError.isFailure) {
                return res.status(402).send(PassagewayOrError.errorValue())
            }

            const PassagewayDTO = PassagewayOrError.getValue();
            return res.status(201).json(PassagewayDTO);

        }catch (e){
            return next(e);
        }
    }
}
