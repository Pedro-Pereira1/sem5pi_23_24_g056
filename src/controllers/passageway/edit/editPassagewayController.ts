import {Inject, Service} from "typedi";
import IEditPassagewayController from "../../IControllers/passageway/edit/IEditPassagewayController";
import config from "../../../../config";
import {NextFunction, Request, Response} from "express";
import {Result} from "../../../core/logic/Result";
import IEditPassagewayService from "../../../services/IServices/passageway/edit/IEditPassagewayService";
import IEditPassagewayDTO from "../../../dto/passageway/IEditPassagewayDTO";
import {IPassagewayDTO} from "../../../dto/passageway/IPassagewayDTO";

@Service()
export default class EditPassagewayController implements IEditPassagewayController {

    constructor(
        @Inject(config.services.editPassageway.name) private service: IEditPassagewayService
    )
    {}

    public async editPassageway(req: Request, res: Response, next: NextFunction) {
        try {

            const passagewayOrError = await this.service.editPassageway(req.body as IEditPassagewayDTO) as Result<IPassagewayDTO>

            if (passagewayOrError.isFailure) {
                return res.status(400).send(passagewayOrError.errorValue())
            }

            const passagewayDTO = passagewayOrError.getValue();
            return res.status(201).json(passagewayDTO);

        }catch (e){
            return next(e);
        }
    }
}