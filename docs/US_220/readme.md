# US 220 - As a Campus Manager, I want to list the floors of a building with a passageway


## 1. Context

* This task comes in context of Sprint A.
* First time that this task is developed.
* This task is relative to system user Campus Manager.

## 2. Requirements

**US 220 -** As a Campus Manager, I want to:

* list floors of a building with a passageway.

**Client Clarifications**
> **Q**: ... seria expectável incluir informação relativa a onde a(s) passagem(ns) de cada piso vão ter; ou o pretendido é simplesmente ser possível saber quais dos pisos de um dado edifício possuem passagens para outros?
<br>
> **A**: ... esta listagem deve mostrar a informação sobre o piso (edificio, piso, descrição) e a que outros edificios/pisos tem passagem.

**Dependencies:**
- **US150 -** As a Campus Manager, I want to create a building.
- **US190 -** As a Campus Manager, I want to create building floor.
- **US240 -** As a Campus Manager, I want to create a passageway between buildings.

## 3. Analysis

Regarding this requirement we understand that: As a Campus Manager, an actor of the system, I will be able to list the floors of a building with a passageway,describing the floor and description
and also the building and floor where the passageway connects to.
* Campus Manager is a user role that manages the data of the routes and maps.
* Building is a structure within the campus that houses various rooms and facilities. It can be navigated by the robisep robots using corridors and elevators.
* Floor is a level within a building. Each floor can contain multiple rooms and is accessible by elevators and stairs (though robisep robots cannot use stairs).

### 3.1. Domain Model Excerpt

![DomainModelExcerpt](./Diagrams/DomainModelExcerpt.svg)

## 4. Design
### Level 1

* Logical View

![Logical](./Diagrams/Level1/LogicalViewLevel1.svg)

* Process View

![Process](./Diagrams/Level1/SystemSequenceDiagram.svg)

* Scenary View

![Scenary](./Diagrams/Level1/ScenaryViewLevel1.svg)

### level 2

* Logical View

![Logical](./Diagrams/Level2/LogicalViewLevel2.svg)

* Process View

![Process](./Diagrams/Level2/SequenceDiagramLevel2.svg)

* Physical View

![physical](./Diagrams/Level2/PhysicalViewLevel2.svg)

* Implementation View

![Implementation](./Diagrams/Level2/ImplementationViewLevel2.svg)

### Level 3

* Logical:

![Logical](./Diagrams/Level3/logicalViewMasterDataBuilding.svg)

* Implementation

![Implementation](./Diagrams/Level3/ImplementaionViewLevel3.svg)

* Process

![Process](./Diagrams/Level3/SequenceDiagramLevel3.svg)

### 4.2. Applied Patterns
* Controller
* Service
* Repository
* Mapper
* DTO
* GRASP

### 4.3. Tests

**Test 1:** *Tests the controller using a stub service to list floors with passageways*

```
it("ListFloorsPassagewaysController unit test using ListFloorsPassagewaysService stub", async function() {

        let body = {};
        let req: Partial<Request> = {};
        req.body = body;
        req.params = {
            buildingCode: "A"
        }
        let res: Partial<Response> = {
            json: sinon.spy(),
            status: sinon.stub().returnsThis(),
            send: sinon.spy()
        };
        let next: Partial<NextFunction> = () => {};

        let listFloorsPassagewaysServiceInstance = Container.get("listFloorsPassagewaysService");

        const buildingDTO = {
            buildingName: "EdificioA",
            buildingDescription: "uma descricao",
            buildingCode: "A",
            buildingLength: 2,
            buildingWidth: 2
        } as IBuildingDTO

        const building = Building.create({
            buildingName: new BuildingName({ value: buildingDTO.buildingName }),
            buildingDescription: new BuildingDescription({ value: buildingDTO.buildingDescription }),
            buildingSize: new BuildingSize({ length: buildingDTO.buildingLength, width: buildingDTO.buildingWidth }),
            floors: [],
        }, buildingDTO.buildingCode).getValue()

        const building2DTO = {
            buildingName: "EdificioB",
            buildingDescription: "uma descricao",
            buildingCode: "B",
            buildingLength: 2,
            buildingWidth: 2
        } as IBuildingDTO

        const building2 = Building.create({
            buildingName: new BuildingName({ value: building2DTO.buildingName }),
            buildingDescription: new BuildingDescription({ value: building2DTO.buildingDescription }),
            buildingSize: new BuildingSize({ length: building2DTO.buildingLength, width: building2DTO.buildingWidth }),
            floors: [],
        }, building2DTO.buildingCode).getValue()

        const FloorDTO = {
            floorId: 1,
            floorNumber: 1,
            floorDescription: "Joi.string().max(255)",
            floorMap: {
                map: [],
                passageways: [],
                rooms: [],
                elevators: [],
                passagewaysCoords: [],
                elevatorsCoords: [],
                roomCoords: []
            }
        } as IFloorDTO

        const floor = Floor.create(
            {
                "floorNumber": new FloorNumber({number: FloorDTO.floorNumber}),
                "floorDescription": new FloorDescription({ value: FloorDTO.floorDescription }),
                "floormap": new FloorMap(
                    {
                        map: [[]],
                        passageways: [],
                        rooms: [],
                        elevators: [],
                        passagewaysCoords: [],
                        elevatorsCoords: [],
                        roomsCoords: [],
                    }
                )
            }, FloorDTO.floorId).getValue()

        const Floor2DTO = {
            floorId: 2,
            floorNumber: 1,
            floorDescription: "Joi.string().max(255)",
            floorMap: {
                map: [],
                passageways: [],
                rooms: [],
                elevators: [],
                passagewaysCoords: [],
                elevatorsCoords: [],
                roomCoords: []
            }
        } as IFloorDTO

        const floor2 = Floor.create(
            {
                "floorNumber": new FloorNumber({number: Floor2DTO.floorNumber}),
                "floorDescription": new FloorDescription({ value: Floor2DTO.floorDescription }),
                "floormap": new FloorMap(
                    {
                        map: [[]],
                        passageways: [],
                        rooms: [],
                        elevators: [],
                        passagewaysCoords: [],
                        elevatorsCoords: [],
                        roomsCoords: [],
                    }
                )
            }, Floor2DTO.floorId).getValue()

        const createPassagewayDTO = {
            passagewayId: 1,
            building1Id: "A",
            floor1Id: 1,
            building2Id: "B",
            floor2Id: 2,
        } as ICreatePassagewayDTO

        const passageway = Passageway.create(
            {
                passagewayId: createPassagewayDTO.passagewayId,
                building1Id: createPassagewayDTO.building1Id,
                floor1Id: createPassagewayDTO.floor1Id,
                building2Id: createPassagewayDTO.building2Id,
                floor2Id: createPassagewayDTO.floor2Id,
            }).getValue()

        building.addFloor(floor);
        building2.addFloor(floor2);
        floor.addPassageway(passageway);
        floor2.addPassageway(passageway)

        sinon.stub(listFloorsPassagewaysServiceInstance, "listFloorsPassageways").returns(
            Result.ok<IFloorDTO[]>([FloorDTO])
        );


        const ctrl = new ListFloorsPassagewaysController(listFloorsPassagewaysServiceInstance as IListFloorsPassagewaysService);

        // Act
        await ctrl.listFloorsPassageways(<Request>req, <Response>res, <NextFunction>next);

        // Assert
        sinon.assert.calledOnce(res.json);
        sinon.assert.calledWith(res.json, sinon.match([FloorDTO]));
    });
````

**Test 2:** *Tests the service using a stub repo to list floors with passageways*

```
it("ListFloorsPassagewaysController + ListFloorsPassagewaysService integration test", async function() {
        // Arrange
        let body = {};
        let req: Partial<Request> = {};
        req.body = body;
        req.params = {
            buildingCode: "A"
        }
        let res: Partial<Response> = {
            json: sinon.spy(),
            status: sinon.stub().returnsThis(),
            send: sinon.spy()
        };
        let next: Partial<NextFunction> = () => {};

        // Stub repo methods
        let listFloorsPassagewaysServiceInstance = Container.get("listFloorsPassagewaysService");

        const buildingDTO = {
            buildingName: "EdificioA",
            buildingDescription: "uma descricao",
            buildingCode: "A",
            buildingLength: 2,
            buildingWidth: 2
        } as IBuildingDTO

        const building = Building.create({
            buildingName: new BuildingName({ value: buildingDTO.buildingName }),
            buildingDescription: new BuildingDescription({ value: buildingDTO.buildingDescription }),
            buildingSize: new BuildingSize({ length: buildingDTO.buildingLength, width: buildingDTO.buildingWidth }),
            floors: [],
        }, buildingDTO.buildingCode).getValue()

        const building2DTO = {
            buildingName: "EdificioB",
            buildingDescription: "uma descricao",
            buildingCode: "B",
            buildingLength: 2,
            buildingWidth: 2
        } as IBuildingDTO

        const building2 = Building.create({
            buildingName: new BuildingName({ value: building2DTO.buildingName }),
            buildingDescription: new BuildingDescription({ value: building2DTO.buildingDescription }),
            buildingSize: new BuildingSize({ length: building2DTO.buildingLength, width: building2DTO.buildingWidth }),
            floors: [],
        }, building2DTO.buildingCode).getValue()

        const FloorDTO = {
            floorId: 1,
            floorNumber: 1,
            floorDescription: "Joi.string().max(255)",
            floorMap: {
                map: [],
                passageways: [],
                rooms: [],
                elevators: [],
                passagewaysCoords: [],
                elevatorsCoords: [],
                roomCoords: []
            }
        } as IFloorDTO

        const floor = Floor.create(
            {
                "floorNumber": new FloorNumber({number: FloorDTO.floorNumber}),
                "floorDescription": new FloorDescription({ value: FloorDTO.floorDescription }),
                "floormap": new FloorMap(
                    {
                        map: [[]],
                        passageways: [],
                        rooms: [],
                        elevators: [],
                        passagewaysCoords: [],
                        elevatorsCoords: [],
                        roomsCoords: [],
                    }
                )
            }, FloorDTO.floorId).getValue()

        const Floor2DTO = {
            floorId: 2,
            floorNumber: 1,
            floorDescription: "Joi.string().max(255)",
            floorMap: {
                map: [],
                passageways: [],
                rooms: [],
                elevators: [],
                passagewaysCoords: [],
                elevatorsCoords: [],
                roomCoords: []
            }
        } as IFloorDTO

        const floor2 = Floor.create(
            {
                "floorNumber": new FloorNumber({number: Floor2DTO.floorNumber}),
                "floorDescription": new FloorDescription({ value: Floor2DTO.floorDescription }),
                "floormap": new FloorMap(
                    {
                        map: [[]],
                        passageways: [],
                        rooms: [],
                        elevators: [],
                        passagewaysCoords: [],
                        elevatorsCoords: [],
                        roomsCoords: [],
                    }
                )
            }, Floor2DTO.floorId).getValue()

        const createPassagewayDTO = {
            passagewayId: 1,
            building1Id: "A",
            floor1Id: 1,
            building2Id: "B",
            floor2Id: 2,
        } as ICreatePassagewayDTO

        const passageway = Passageway.create(
            {
                passagewayId: createPassagewayDTO.passagewayId,
                building1Id: createPassagewayDTO.building1Id,
                floor1Id: createPassagewayDTO.floor1Id,
                building2Id: createPassagewayDTO.building2Id,
                floor2Id: createPassagewayDTO.floor2Id,
            }).getValue()

        building.addFloor(floor);
        building2.addFloor(floor2);
        floor.addPassageway(passageway);
        floor2.addPassageway(passageway)

        buildingRepoMock.findByBuidingCode.resolves(building);
        buildingRepoMock.findByFloor.resolves(building);
        floorRepoMock.findByPassageway.resolves([building2]);
        floorRepoMock.findByPassageway.resolves([floor, floor2]);


        const listFloorsPassagewaysServiceSpy = sinon.spy(listFloorsPassagewaysServiceInstance, "listFloorsPassageways");

        const ctrl = new ListFloorsPassagewaysController(listFloorsPassagewaysServiceInstance as IListFloorsPassagewaysService);

        await ctrl.listFloorsPassageways(<Request>req, <Response>res, <NextFunction>next);

        sinon.assert.calledOnce(res.json);
        sinon.assert.calledWith(res.json,sinon.match([{
            floorNumber: 1,
            floorId: 1,
            floorDescription: "Joi.string().max(255)",
            floorMap: {
                passageways: [
                    1
                ],
            },
            floorConnected: [
                "2",
                "A"
            ]
        }]));
        sinon.assert.calledOnce(listFloorsPassagewaysServiceSpy);
    });
````

## 5. Implementation

**listFloorsPassagewayService:**

```
public async listFloorsPassageways(buildingCode: string): Promise<Result<IListFloorPassagewaysDTO[]>> {


        const buildingResult = await this.buildingRepo.findByBuidingCode(new BuildingCode(buildingCode))
        if (buildingResult === null) {
            return Result.fail<IListFloorPassagewaysDTO[]>(`Building ${buildingCode} not found`)
        }

        const floorsResult = buildingResult.floors

        if (floorsResult.length === 0) {
            return Result.fail<IListFloorPassagewaysDTO[]>(`Building ${buildingCode} has no floors`)
        }

        let resolve: IListFloorPassagewaysDTO[] = []

        for (var floor of floorsResult) {
            if (floor.map.passagewaysId.length > 0) {
                const floorsConnected: string[] = [];
                for (var passagewayId of floor.map.passagewaysId) {
                    const currentFloors = await this.floorRepo.findByPassageway(passagewayId)

                    for (var floor1 of currentFloors) {
                        if (floor1.floorId.toValue() !== floor.floorId.toValue()) {
                            floorsConnected.push(floor1.floorId.toString())
                            const building = await this.buildingRepo.findByFloor(Number(floor1.floorId.toValue()))
                            if (building !== null) {
                                floorsConnected.push(building.code.toString())
                            }
                        }
                    }
                }
                resolve.push(FloorMaper.toDtoList(floor, floorsConnected))
            }
        }

        return Result.ok<IListFloorPassagewaysDTO[]>(resolve)
    }
````

## 6. Integration/Demonstration

To use this US, you need to send and HTTP request with the following URI:

localhost:4000/api/floors/listFloorsPassageways/D

## 7. Observations

No additional observations.