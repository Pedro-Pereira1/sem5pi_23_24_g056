import { Inject, Service } from "typedi";
import IListBuildingsMaxMinFloorsController from "../../IControllers/building/list/IListBuildingsMaxMinFloorsController";
import { Request, Response, NextFunction } from "express";
import { ParamsDictionary } from "express-serve-static-core";
import config from "../../../../config";
import IListBuildingsMaxMinFloorsService from "../../../services/IServices/building/IListBuildingsMaxMinFloorsService";
import { IBuildingListMaxMinDTO } from "../../../dto/building/IBuildingListMaxMinDTO";
import { Result } from "../../../core/logic/Result";
import { IBuildingDTO } from "../../../dto/building/IBuildingDTO";
import { IAuthService } from "../../../services/IServices/auth/IAuthService";

@Service()
export default class ListBuildingsMaxMinFloorsController implements IListBuildingsMaxMinFloorsController {

    constructor(
        @Inject(config.services.listBuildingsMaxMinFloors.name) private listBuildingsMaxMinFloorsService: IListBuildingsMaxMinFloorsService,
        @Inject(config.services.auth.name) private authService: IAuthService
    )
    {}

    public async listBuildingsMaxMinFloors(req: Request, res: Response, next: NextFunction) {
        if(!this.authService.validateToken(req)){
            return res.status(401).send("Unauthorized");
        }
        //@ts-ignore
        let userRole = req.userRole;
        if(!this.authService.validatePermission(userRole, ["CampusManager"])){
            return res.status(401).send("Unauthorized");
        }
        try{
            const max = Number(req.params.max);
            const min = Number(req.params.min);

            const buildingsOrError = await this.listBuildingsMaxMinFloorsService.listBuildingsMaxMinFloors(max,min)

            if(buildingsOrError.isFailure){
                return res.status(400).send(buildingsOrError.errorValue())
            }

            res.status(200).json(buildingsOrError.getValue());
        }catch(error){
            res.status(500).json({ error: "Internal Server Error" });
        }
    }


}
