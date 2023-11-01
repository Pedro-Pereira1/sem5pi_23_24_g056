import * as sinon from 'sinon';

import IElevatorDTO from '../../src/dto/elevator/IElevatorDTO';
import { Elevator } from '../../src/domain/Elevator/Elevator';
import assert from 'assert';
import { ElevatorCoordinateX } from '../../src/domain/Elevator/ElevatorCoordinateX';
import { ElevatorCoordinateY } from '../../src/domain/Elevator/ElevatorCoordinateY';
import { ElevatorIdentificationNumber } from '../../src/domain/Elevator/ElevatorIdentificationNumber';
import { ElevatorBrand } from '../../src/domain/Elevator/ElevatorBrand';
import { ElevatorDescription } from '../../src/domain/Elevator/ElevatorDescription';
import { ElevatorModel } from '../../src/domain/Elevator/ElevatorModel';
import { ElevatorSerialNumber } from '../../src/domain/Elevator/ElevatorSerialNumber';

describe("Create elevator", function () {
    const sandbox = sinon.createSandbox();

    beforeEach(function () {
    });

    afterEach(function () {
        sandbox.restore();
    });

    it('Create elevator test, valid elevator', async function () {
        const elevatorDto = {
            elevatorCoordinateX: 3,
            elevatorCoordinateY: 6,
            elevatorBrand: 'Apple',
            elevatorIdentificationNumber: 35,
            elevatorDescription: 'This is an elevator',
            elevatorModel: 'Ieli',
            elevatorSerialNumber: '445'
        } as IElevatorDTO

        const elevator = Elevator.create({
            elevatorCoordinateX: new ElevatorCoordinateX({ elevatorCoordinateX: elevatorDto.elevatorCoordinateX }),
            elevatorCoordinateY: new ElevatorCoordinateY({ elevatorCoordinateY: elevatorDto.elevatorCoordinateY }),
            elevatorIdentificationNumber: new ElevatorIdentificationNumber({ identificationNumber: elevatorDto.elevatorIdentificationNumber }),
            elevatorBrand: new ElevatorBrand({ brand: elevatorDto.elevatorBrand }),
            elevatorDescription: new ElevatorDescription({ description: elevatorDto.elevatorDescription }),
            elevatorModel: new ElevatorModel({ model: elevatorDto.elevatorModel }),
            elevatorSerialNumber: new ElevatorSerialNumber({ serialNumber: elevatorDto.elevatorSerialNumber })
        })

        assert.equal(elevator.isSuccess, true)
    })

    /*
    it('Controller unit test with stub service, invalid elevator', async function () {
        let req: Partial<Request> = {}
        let res: Partial<Response> = {
            status: sinon.spy()
        }

        let next: Partial<NextFunction> = () => { }

        let createelevatorService = Container.get('CreateelevatorService')
        sinon.stub(createelevatorService, 'createelevator').returns(Result.fail<elevator>('Error'))

        const createelevatorController = new CreateelevatorController(createelevatorService as ICreateelevatorService)

        await createelevatorController.createelevator(<Request>req, <Response>res, <NextFunction>next)

        sinon.assert.calledOnce(res.status)
        sinon.match(403)
    })*/

    it('Service unit test with stud repo, invalid elevator', async function () {

    })

    it('Repo unit test, valid elevator', async function () {

    })

    it('Repo unit test, invalid elevator', async function () {

    })

    it('Controller + service integration test using elevatorRepo and elevator stub', async function () {

    })

    it('Controller + service + repo integration test', async function () {

    })

})