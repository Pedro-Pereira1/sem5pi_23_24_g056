import { NextFunction, Request, Response } from 'express';
import IEditFloorController from '../../IControllers/floor/edit/IEditFloorController';
import { Inject, Service } from 'typedi';
import config from "../../../../config";
import { Result } from '../../../core/logic/Result';
import { IEditFloorDTO } from '../../../dto/floor/IEditFloorDTO';
import IEditFloorService from '../../../services/IServices/floor/edit/IEditFloorService';
import { IFloorDTO } from '../../../dto/floor/IFloorDTO';
import { IAuthService } from '../../../services/IServices/auth/IAuthService';
@Service()
export default class EditFloorController implements IEditFloorController {
	constructor(
		@Inject(config.services.editFloor.name) private service: IEditFloorService,
        @Inject(config.services.auth.name) private authService: IAuthService
	)
    {}

	public async editFloor(req: Request, res: Response, next: NextFunction) {
		//@ts-ignore
        let userRole = req.userRole;
        if(!this.authService.validatePermission(userRole, ["CampusManager"])){
            return res.status(401).send("Unauthorized");
        }
		try {
			const floorOrError = await this.service.editFloor(req.body as IEditFloorDTO) as Result<IFloorDTO>

			if (floorOrError.isFailure) {
				return res.status(400).send(floorOrError.error);
			}
			const FloorDTO = floorOrError.getValue();
			return res.status(200).json(FloorDTO);
		} catch (e) {
			return next(e);
		}
	}
}
