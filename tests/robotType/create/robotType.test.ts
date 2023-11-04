import 'reflect-metadata';
import * as sinon from 'sinon';
import { Response, Request, NextFunction } from 'express';
import { Container } from 'typedi';
import assert from 'assert';
import { ICreateRobotTypeDTO } from '../../../src/dto/robotType/ICreateRobotTypeDTO';
import { RobotType } from '../../../src/domain/RobotType/RobotType';
import { IRobotTypeDTO } from '../../../src/dto/robotType/IRobotTypeDTO';
import { AvailableTask } from '../../../src/domain/RobotType/AvailableTask';
import { RobotBrand } from '../../../src/domain/RobotType/RobotBrand';
import { RobotModel } from '../../../src/domain/RobotType/RobotModel';
import createRobotTypeController from '../../../src/controllers/robotType/create/createRobotTypeController';
import ICreateRobotTypeService from '../../../src/services/IServices/robotType/create/ICreateRobotTypeService';
import { Result } from '../../../src/core/logic/Result';


describe("Create robot Type", function () {
    const sandbox = sinon.createSandbox();
    let robotTypeRepoMock;


    beforeEach(function () {
        Container.reset();

        robotTypeRepoMock = {
            exists: sinon.stub(),
            save: sinon.stub(),
            findById: sinon.stub(),
        };
        Container.set('robotTypeRepo', robotTypeRepoMock);


        let robotTypSchemaInstance = require('../../../src/persistence/schemas/robotType/robotTypeSchema').default
        Container.set('robotTypeSchema', robotTypSchemaInstance)

        let createRobotTypeServiceClass = require('../../../src/services/robotType/create/createRobotTypeService').default
        let createRobotTypeServiceInstance = Container.get(createRobotTypeServiceClass)
        Container.set('createRobotTypeService', createRobotTypeServiceInstance)

    });

    afterEach(function () {
        sandbox.restore();
        sinon.restore();
    });

    it('should create a RobotType instance with valid input', function () {
        // Arrange
        const robotTypeDTO: ICreateRobotTypeDTO = {
            "robotTypeID": "k4",
            "robotBrand": "Joi.string().max(0).required()",
            "robotModel": " Joi.string().max(100).required()",
            "availableTasks": ["Floor surveillance","Object transport"]
        };

        // Act
        const result = RobotType.create(robotTypeDTO, robotTypeDTO.robotTypeID);

        // Assert
        assert.ok(result.isSuccess);
        assert.ok(result.getValue() instanceof RobotType);
        assert.strictEqual(result.getValue().id.toString(), robotTypeDTO.robotTypeID);
        assert.strictEqual(result.getValue().props.robotBrand.brand, robotTypeDTO.robotBrand);
        assert.strictEqual(result.getValue().props.robotModel.model, robotTypeDTO.robotModel);
        assert.strictEqual(result.getValue().props.availableTasks[0].props.Type, robotTypeDTO.availableTasks[0]);
        assert.strictEqual(result.getValue().props.availableTasks[1].props.Type, robotTypeDTO.availableTasks[1]);
    });

    it('should fail to create a RobotType instance with invalid robotBrand', function () {
        // Arrange
        const robotTypeDTO1: ICreateRobotTypeDTO = {
            "robotTypeID": "k4",
            "robotBrand": "",
            "robotModel": " Joi.string().max(100).required()",
            "availableTasks": ["Floor surveillance","Object transport"]
        };

        const robotTypeDTO2: ICreateRobotTypeDTO = {
            "robotTypeID": "k4",
            "robotBrand": 'a'.repeat(51),
            "robotModel": " Joi.string().max(100).required()",
            "availableTasks": ["Floor surveillance","Object transport"]
        };

        // Act
        const result1 = RobotType.create(robotTypeDTO1, robotTypeDTO1.robotTypeID);
        const result2 = RobotType.create(robotTypeDTO2, robotTypeDTO2.robotTypeID);

        // Assert
        assert.ok(result1.isFailure);
        assert.ok(result2.isFailure);
    });

    it('should fail to create a RobotType instance with invalid robotModel', function () {
        // Arrange
        const robotTypeDTO1: ICreateRobotTypeDTO = {
            "robotTypeID": "k4",
            "robotBrand": "Joi.string().max(0).required()",
            "robotModel": "",
            "availableTasks": ["Floor surveillance","Object transport"]
        };

        const robotTypeDTO2: ICreateRobotTypeDTO = {
            "robotTypeID": "k4",
            "robotBrand": "Joi.string().max(0).required()",
            "robotModel": 'a'.repeat(101),
            "availableTasks": ["Floor surveillance","Object transport"]
        };

        // Act
        const result1 = RobotType.create(robotTypeDTO1, robotTypeDTO1.robotTypeID);
        const result2 = RobotType.create(robotTypeDTO2, robotTypeDTO2.robotTypeID);

        // Assert
        assert.ok(result1.isFailure);
        assert.ok(result2.isFailure);
    });

    it('should fail to create a RobotType instance with invalid availableTasks', function () {
        // Arrange
        const robotTypeDTO1: ICreateRobotTypeDTO = {
            "robotTypeID": "k4",
            "robotBrand": "Joi.string().max(0).required()",
            "robotModel": "Joi.string().max(0).required()",
            "availableTasks": ["Floor surv2eillance","Object transport"]
        };

        const robotTypeDTO2: ICreateRobotTypeDTO = {
            "robotTypeID": "k4",
            "robotBrand": "Joi.string().max(0).required()",
            "robotModel": "Joi.string().max(0).required()",
            "availableTasks": ["Floor surveillance","Object transport","Floor surveillance"]
        };

        // Act
        const result1 = RobotType.create(robotTypeDTO1, robotTypeDTO1.robotTypeID);
        const result2 = RobotType.create(robotTypeDTO2, robotTypeDTO2.robotTypeID);

        // Assert
        assert.ok(result1.isFailure);
        assert.ok(result2.isFailure);
    });

    it('createRobotTypeController unit test using createRobotTypeService stub', async function () {
        // Arrange
        let body = {
            "robotTypeID": "k4",
            "robotBrand": "Joi.string().max(0).required()",
            "robotModel": " Joi.string().max(100).required()",
            "availableTasks": ["Floor surveillance","Object transport"]
        };
        let req: Partial<Request> = {};
          req.body = body;
        let res: Partial<Response> = {
          json: sinon.spy(),
          status: sinon.stub().returnsThis(),
          send: sinon.spy()
        };
        let next: Partial<NextFunction> = () => {};

        const robotTypeDTO: IRobotTypeDTO = {
            "robotTypeID": "k4",
            "robotBrand": "Joi.string().max(0).required()",
            "robotModel": " Joi.string().max(100).required()",
            "availableTasks": ["Floor surveillance","Object transport"]
        };



        let createRobotTypeServiceInstance = Container.get("createRobotTypeService");
        sinon.stub(createRobotTypeServiceInstance, "createRobotType").returns(Promise.resolve(Result.ok<IRobotTypeDTO>(robotTypeDTO)));

        const ctrl = new createRobotTypeController(createRobotTypeServiceInstance as ICreateRobotTypeService);

        // Act
        await ctrl.createRobotType(<Request>req, <Response>res, <NextFunction>next);

        // Assert
        sinon.assert.calledOnce(res.json);
        sinon.assert.calledWith(res.json, sinon.match({
            "robotTypeID": "k4",
            "robotBrand": "Joi.string().max(0).required()",
            "robotModel": " Joi.string().max(100).required()",
            "availableTasks": ["Floor surveillance","Object transport"]
        }));

    });

    it("createRobotTypeController +createRobotTypeService integration test", async function() {
        // Arrange
        let body = {
            "robotTypeID": "k4",
            "robotBrand": "Joi.string().max(0).required()",
            "robotModel": " Joi.string().max(100).required()",
            "availableTasks": ["Floor surveillance","Object transport"]
        };
        let req: Partial<Request> = {
          body: body
        };
        let res: Partial<Response> = {
          json: sinon.spy(),
          status: sinon.stub().returnsThis(),
          send: sinon.spy()
        };
        let next: Partial<NextFunction> = () => {};

        // Stub repo methods
        const robotTypeDTO: IRobotTypeDTO = {
            "robotTypeID": "k4",
            "robotBrand": "Joi.string().max(0).required()",
            "robotModel": " Joi.string().max(100).required()",
            "availableTasks": ["Floor surveillance","Object transport"]
        };
        
        robotTypeRepoMock.findById.resolves(null);
        
        let createRobotTypeServiceInstance = Container.get("createRobotTypeService");
        const createRobotTypeServiceSpy = sinon.spy(createRobotTypeServiceInstance, "createRobotType");

        const ctrl = new createRobotTypeController(createRobotTypeServiceInstance as ICreateRobotTypeService);

        // Act
        await ctrl.createRobotType(<Request>req, <Response>res, <NextFunction>next);

        // Assert
        sinon.assert.calledOnce(res.json);
        sinon.assert.calledWith(res.json, sinon.match({
            "robotTypeID": "k4",
            "robotBrand": "Joi.string().max(0).required()",
            "robotModel": " Joi.string().max(100).required()",
            "availableTasks": ["Floor surveillance","Object transport"]
        }));
        sinon.assert.calledOnce(createRobotTypeServiceSpy);

      }); 

      it("createRobotTypeController +createRobotTypeService integration test (RobotType already exists)", async function() {
        // Arrange
        let body = {
            "robotTypeID": "k4",
            "robotBrand": "Joi.string().max(0).required()",
            "robotModel": " Joi.string().max(100).required()",
            "availableTasks": ["Floor surveillance","Object transport"]
        };
        let req: Partial<Request> = {
          body: body
        };
        let res: Partial<Response> = {
          json: sinon.spy(),
          status: sinon.stub().returnsThis(),
          send: sinon.spy()
        };
        let next: Partial<NextFunction> = () => {};

        // Stub repo methods
        const robotTypeDTO: IRobotTypeDTO = {
            "robotTypeID": "k4",
            "robotBrand": "Joi.string().max(0).required()",
            "robotModel": " Joi.string().max(100).required()",
            "availableTasks": ["Floor surveillance","Object transport"]
        };
        
        robotTypeRepoMock.findById.resolves(robotTypeDTO);
        
        let createRobotTypeServiceInstance = Container.get("createRobotTypeService");
        const createRobotTypeServiceSpy = sinon.spy(createRobotTypeServiceInstance, "createRobotType");

        const ctrl = new createRobotTypeController(createRobotTypeServiceInstance as ICreateRobotTypeService);

        // Act
        await ctrl.createRobotType(<Request>req, <Response>res, <NextFunction>next);

        // Assert
        sinon.assert.calledOnce(createRobotTypeServiceSpy);
        sinon.assert.calledOnce(res.status);
        sinon.assert.calledWith(res.status,400);
        sinon.assert.calledOnce(res.send);
        sinon.assert.calledWith(res.send, sinon.match("RobotType already exists"));

      });



    
});
