import { NextFunction, Request, Response } from "express";
import ICreatePassagewayController from "../../IControllers/passageway/create/ICreatePassagewayController";
import { Inject, Service } from "typedi";
import config from "../../../../config";
import ICreatePassagewayService from "../../../services/IServices/passageway/create/ICreatePassagewayService";
import { PassagewayMap } from "../../../mappers/passageway/PassagewayMap";
import { IPassagewayDTO } from "../../../dto/passageway/IPassagewayDTO";
import { Result } from "../../../core/logic/Result";
import { ICreatePassagewayDTO } from "../../../dto/passageway/ICreatePassagewayDTO";
import { IAuthService } from "../../../services/IServices/auth/IAuthService";

@Service()
export default class CreatePassagewayController implements ICreatePassagewayController {

    constructor(
        @Inject(config.services.createPassageway.name) private service: ICreatePassagewayService,
        @Inject(config.services.auth.name) private authService: IAuthService
    )
    {}

    public async createPassageway(req: Request, res: Response, next: NextFunction) {
        if(!this.authService.validateToken(req)){
            return res.status(401).send("Unauthorized");
        }
        //@ts-ignore
        let userRole = req.userRole;
        if(!this.authService.validatePermission(userRole, ["CampusManager"])){
            return res.status(401).send("Unauthorized");
        }
        try {
            const PassagewayOrError = await this.service.createPassageway(req.body as ICreatePassagewayDTO) as Result<IPassagewayDTO>

            if (PassagewayOrError.isFailure) {
                return res.status(400).send(PassagewayOrError.errorValue())
            }

            const PassagewayDTO = PassagewayOrError.getValue();
            return res.status(201).json(PassagewayDTO);

        }catch(error){
            return next(error);
        }
    }
}
