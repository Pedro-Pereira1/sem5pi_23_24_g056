import { Inject, Service } from 'typedi';
import { Result } from '../../../core/logic/Result';
import { Robot } from '../../../domain/Robot/Robot';
import IListRobotsByAvailableTasksDTO from '../../../dto/robot/IListRobotsByAvailableTasksDTO';
import IListAllRobotsByAvailableTaskService from '../../IServices/robot/list/IListAllRobotsByAvailableTasksService'
import config from '../../../../config';
import { AvailableTask } from '../../../domain/RobotType/AvailableTask';
import IRobotRepo from '../../IRepos/robot/IRobotRepo';
import { IRobotDTO } from '../../../dto/robot/IRobotDTO';
import { RobotMap } from '../../../mappers/robot/RobotMap';

@Service()
export default class ListAllRobotsByAvailableTasksService implements IListAllRobotsByAvailableTaskService {

    constructor(
        @Inject(config.repos.robot.name) private robotRepo: IRobotRepo
    ) {}

    public async listRobotsByAvailableTasks(tasksDto: IListRobotsByAvailableTasksDTO): Promise<Result<IRobotDTO[]>> {
        const tasks: AvailableTask[] = AvailableTask.createList(tasksDto.tasks).getValue()

        const result: Robot[] = await this.robotRepo.findByAvailableTask(tasks)

        if (result.length == 0) {
            return Result.fail<IRobotDTO[]>('There are no robots with that task available')
        }

        let resultDto: IRobotDTO[] = []

        for (const robot of result) {
            resultDto.push(RobotMap.toDto(robot))
        }

        return Result.ok<IRobotDTO[]>(resultDto)
    }

}