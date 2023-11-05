# US 180 - As a Campus Manager, I want to list buildings with min and max floors.

## 1. Context

* First time that this task is developed.
* This task is relative to system user Campus Manager .

## 2. Requirements

**US 180 -** As a Campus Manager, I want to list buildings with min and max floors.

**Dependencies:**
- **US150 -** As a Campus Manager, I want to create a building.

**Regarding this requirement we understand that:** <br>
As a Campus Manager, an actor of the system, I will be able to access the system list buildings specifying a min and max of floors.

## 3. Analysis

**Analyzing this User Story we understand that:**
* Campus Manager is a user role that manages the data of the routes and maps.
* Building is a structure within the campus that houses various rooms and facilities. It can be navigated by the robisep robots using corridors and elevators.
* Floor is a level within a building. Each floor can contain multiple rooms and is accessible by elevators and stairs (though robisep robots cannot use stairs).

### 3.1. Domain Model Excerpt
![DomainModelExcerpt](Diagrams/DomainModelExcerpt.svg)


## 4. Design

### 4.1. Realization

### Level1
###### LogicalView:
![LogicalView](Diagrams/Level1/LogicalView.svg)

###### SceneryView:
![SceneryView](Diagrams/Level1/SceneryView.svg)

###### ProcessView:
![ProcessView](Diagrams/Level1/ProcessView.svg)

#### Level2

###### LogicalView:

![LogicalView](Diagrams/Level2/LogicalView.svg)

###### ImplementationView:
![ImplementationView](Diagrams/Level2/ImplementationView.svg)

###### PhysicalView:
![PhysicalView](Diagrams/Level2/PhysicalView.svg)

###### ProcessView:
![ProcessView](Diagrams/Level2/ProcessView.svg)

#### Level3
###### LogicalView:
![LogicalView](Diagrams/Level3/LogicalView.svg)

###### ImplementationView:
![ImplementationView](Diagrams/Level3/ImplementationView.svg)

###### ProcessView:
![ProcessView](Diagrams/Level3/ProcessView.svg)


### 4.3. Applied Patterns
* Controller
* Service
* Repository
* Mapper
* DTO
* GRASP


### 4.4. Tests

**Test 1:** *Tests the controller's behavior in isolation by stubbing the service, ensuring it correctly handles the data received from the service, and responds appropriately.*
```
it("BuildingController unit test using BuildingService stub", async function() {
		// Arrange
		let body = {};
		let req: Partial<Request> = {};
		req.body = body;
		req.params = {
			max: "3",
			min: "1"
		  }
		let res: Partial<Response> = {
		  json: sinon.spy(),
		  status: sinon.stub().returnsThis(),
		  send: sinon.spy()
		};
		let next: Partial<NextFunction> = () => {};

		let listBuildingsMaxMinFloorsServiceInstance = Container.get("listBuildingsMaxMinFloorsService");

		// Stub the createBuilding method in the BuildingService
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

		  const floor = Floor.create(
			{
			  "floorNumber": new FloorNumber({number: 1}),
			  "floorDescription": new FloorDescription({ value: 'Test floor' }),
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
		  }, 1 ).getValue()

		  building.addFloor(floor);


		sinon.stub(listBuildingsMaxMinFloorsServiceInstance, "listBuildingsMaxMinFloors").returns(Result.ok<IBuildingDTO[]>([buildingDTO]));


		const ctrl = new ListBuildingsMaxMinFloorsController(listBuildingsMaxMinFloorsServiceInstance as IListBuildingsMaxMinFloorsService);

		// Act
		await ctrl.listBuildingsMaxMinFloors(<Request>req, <Response>res, <NextFunction>next);

		// Assert
		sinon.assert.calledOnce(res.json);
		sinon.assert.calledWith(res.json, sinon.match([buildingDTO]));
	});
````

**Test 2:** *Tests the interaction between the controller and the actual service, making sure that the controller correctly processes and responds to data received from the service.*
```
it("BuildingController + BuildingService integration test", async function() {
		// Arrange
		let body = {};
		let req: Partial<Request> = {};
		req.body = body;
		req.params = {
			max: "3",
			min: "1"
		  }
		let res: Partial<Response> = {
		  json: sinon.spy(),
		  status: sinon.stub().returnsThis(),
		  send: sinon.spy()
		};
		let next: Partial<NextFunction> = () => {};

		// Stub repo methods
		let listBuildingsMaxMinFloorsServiceInstance = Container.get("listBuildingsMaxMinFloorsService");

		// Stub the createBuilding method in the BuildingService
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

		const floor = Floor.create(
			{
			  "floorNumber": new FloorNumber({number: 1}),
			  "floorDescription": new FloorDescription({ value: 'Test floor' }),
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
		  	}, 1 ).getValue()

		building.addFloor(floor);

		buildingRepoMock.findBuildingsMaxMinFloors.resolves([building]);

		const listBuildingsMaxMinFloorsServiceSpy = sinon.spy(listBuildingsMaxMinFloorsServiceInstance, "listBuildingsMaxMinFloors");

		const ctrl = new ListBuildingsMaxMinFloorsController(listBuildingsMaxMinFloorsServiceInstance as IListBuildingsMaxMinFloorsService);

		// Act
		await ctrl.listBuildingsMaxMinFloors(<Request>req, <Response>res, <NextFunction>next);

		// Assert
		sinon.assert.calledOnce(res.json);
		sinon.assert.calledWith(res.json,sinon.match([{
			buildingCode: "A",
			buildingDescription: "uma descricao",
			buildingFloors: [1],
			buildingLength: 2,
			buildingName: "EdificioA",
			buildingWidth: 2
		  }]));
		sinon.assert.calledOnce(listBuildingsMaxMinFloorsServiceSpy);
	  });
````
**Test 3:** *Checks if the controller handles and responds to service errors properly, ensuring it sends an appropriate response to the client.*
```
it("BuildingController + BuildingService integration test (Test 500 Internal server Error)", async function() {
		// Arrange
		let body = {};
		let req: Partial<Request> = {};
		req.body = body;
		req.params = {
			max: "3",
			min: "1"
		  }
		let res: Partial<Response> = {
		  json: sinon.spy(),
		  status: sinon.stub().returnsThis(),
		  send: sinon.spy()
		};
		let next: Partial<NextFunction> = () => {};

		// Stub repo methods
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

		  const floor = Floor.create(
			{
			  "floorNumber": new FloorNumber({number: 1}),
			  "floorDescription": new FloorDescription({ value: 'Test floor' }),
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
		  }, 1 ).getValue()

		  building.addFloor(floor);

		buildingRepoMock.findBuildingsMaxMinFloors.resolves(building);

		let listBuildingsMaxMinFloorsServiceInstance = Container.get("listBuildingsMaxMinFloorsService");
		const listBuildingsMaxMinFloorsServiceSpy = sinon.spy(listBuildingsMaxMinFloorsServiceInstance, "listBuildingsMaxMinFloors");

		const ctrl = new ListBuildingsMaxMinFloorsController(listBuildingsMaxMinFloorsServiceInstance as IListBuildingsMaxMinFloorsService);

		// Act
		await ctrl.listBuildingsMaxMinFloors(<Request>req, <Response>res, <NextFunction>next);

		// Assert
		sinon.assert.calledOnce(res.json);
		sinon.assert.calledWith(res.json,sinon.match({ error: "Internal Server Error" }));
		sinon.assert.calledOnce(res.status);
		sinon.assert.calledWith(res.status,500);
	  });
````

**Test 4:** *Checks if the controller can correctly handle the scenario where no data is returned from the service, responding with an appropriate message.*
```
it("BuildingController + BuildingService integration test (No buildings found)", async function() {
		// Arrange
		let body = {};
		let req: Partial<Request> = {};
		req.body = body;
		req.params = {
			max: "3",
			min: "1"
		  }
		let res: Partial<Response> = {
		  json: sinon.spy(),
		  status: sinon.stub().returnsThis(),
		  send: sinon.spy()
		};
		let next: Partial<NextFunction> = () => {};

		// Stub repo methods
		buildingRepoMock.findBuildingsMaxMinFloors.resolves([]);

		let listBuildingsMaxMinFloorsServiceInstance = Container.get("listBuildingsMaxMinFloorsService");
		const listBuildingsMaxMinFloorsServiceSpy = sinon.spy(listBuildingsMaxMinFloorsServiceInstance, "listBuildingsMaxMinFloors");

		const ctrl = new ListBuildingsMaxMinFloorsController(listBuildingsMaxMinFloorsServiceInstance as IListBuildingsMaxMinFloorsService);

		// Act
		await ctrl.listBuildingsMaxMinFloors(<Request>req, <Response>res, <NextFunction>next);

		// Assert
		sinon.assert.calledOnce(res.status);
        sinon.assert.calledWith(res.status,400);
        sinon.assert.calledOnce(res.send);
        sinon.assert.calledWith(res.send, sinon.match("No buildings found"));
	  });
````

**Test 5:** *Ensures the controller validates input data and correctly responds when the input parameters do not meet the required criteria.*
```
it("BuildingController + BuildingService integration test (max < min)", async function() {
		// Arrange
		let body = {};
		let req: Partial<Request> = {};
		req.body = body;
		req.params = {
			max: "3",
			min: "5"
		  }
		let res: Partial<Response> = {
		  json: sinon.spy(),
		  status: sinon.stub().returnsThis(),
		  send: sinon.spy()
		};
		let next: Partial<NextFunction> = () => {};

		// Stub repo methods
		buildingRepoMock.findBuildingsMaxMinFloors.resolves([]);

		let listBuildingsMaxMinFloorsServiceInstance = Container.get("listBuildingsMaxMinFloorsService");
		const listBuildingsMaxMinFloorsServiceSpy = sinon.spy(listBuildingsMaxMinFloorsServiceInstance, "listBuildingsMaxMinFloors");

		const ctrl = new ListBuildingsMaxMinFloorsController(listBuildingsMaxMinFloorsServiceInstance as IListBuildingsMaxMinFloorsService);

		// Act
		await ctrl.listBuildingsMaxMinFloors(<Request>req, <Response>res, <NextFunction>next);

		// Assert
		sinon.assert.calledOnce(res.status);
        sinon.assert.calledWith(res.status,400);
        sinon.assert.calledOnce(res.send);
        sinon.assert.calledWith(res.send, sinon.match("max < min"));
	  });
````

## 5. Implementation

*In this section the team should present, if necessary, some evidencies that the implementation is according to the design. It should also describe and explain other important artifacts necessary to fully understand the implementation like, for instance, configuration files.*

*It is also a best practice to include a listing (with a brief summary) of the major commits regarding this requirement.*

## 6. Integration/Demonstration

*In this section the team should describe the efforts realized in order to integrate this functionality with the other parts/components of the system*

*It is also important to explain any scripts or instructions required to execute an demonstrate this functionality*

## 7. Observations

*This section should be used to include any content that does not fit any of the previous sections.*

*The team should present here, for instance, a critical prespective on the developed work including the analysis of alternative solutioons or related works*

*The team should include in this section statements/references regarding third party works that were used in the development this work.*
