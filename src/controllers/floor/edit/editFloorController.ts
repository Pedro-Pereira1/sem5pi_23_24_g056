import { NextFunction, Request, Response } from 'express';
import IEditFloorController from '../../IControllers/floor/edit/IEditFloorController';
import { Inject, Service } from 'typedi';
import config from "../../../../config";
import { Result } from '../../../core/logic/Result';
import { IEditFloorDTO } from '../../../dto/floor/IEditFloorDTO';
import IEditFloorService from '../../../services/IServices/floor/edit/IEditFloorService';
import { IFloorDTO } from '../../../dto/floor/IFloorDTO';
@Service()
export default class EditFloorController implements IEditFloorController {
	constructor(
		@Inject(config.services.editFloor.name) private service: IEditFloorService
	)
    {}

	public async editFloor(req: Request, res: Response, next: NextFunction) {
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
