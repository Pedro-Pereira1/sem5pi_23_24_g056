import { NextFunction, Request, Response } from 'express';
import IEditFloorController from '../../IControllers/floor/edit/IEditFloorController';
import { Inject, Service } from 'typedi';
import config from "../../../../config";
import { Result } from '../../../core/logic/Result';
import { IFloorDTO } from '../../../dto/floor/IFloorDTO';
import IEditFloorService from '../../../services/IServices/floor/edit/IEditFloorService';


@Service()
export default class EditFloorController implements IEditFloorController {
	constructor(
		@Inject(config.services.editFloor.name) private service: IEditFloorService
	) 
    {}

	public async editFloor(req: Request, res: Response, next: NextFunction) {
		try {
			const floorOrError = await this.service.editFloor( req.body as IFloorDTO) as Result<IFloorDTO>

			if (floorOrError.isFailure) {
				return res.status(402).json(floorOrError.error);
			}
			const FloorDTO = floorOrError.getValue();
			return res.status(200).json(FloorDTO);
		} catch (e) {
			return next(e);
		}
	}
}