# US 270 - As a Campus Manager, I want to create an elevator in a building.

## 1. Context

* First time that this task is developed.
* This task is relative to system user Campus Manager.

## 2. Requirements

**US 270 -** As a Campus Manager, I want to create an elevator in a building.

**Client Clarifications**
>**Question**: "Como tal, gostaria de saber que atributos deveria ter o elevador, para além de uma lista de pisos aos quais consegue aceder dentro do seu edifício. Algumas das ideias que me surgiram foram o piso em que estava localizado naquele momento, número de série, fabricante ou descrição."<br><br>
>**Answer**: "- edificio (obrigatório)<br>
			- número identificativo (obrigatório, único no edificio)<br>
			-lista de pisos do edificio servidos pelo elevador (obrigatório)<br>
			- marca (opcional, alfanumerico, 50 caracteres)<br>
			- modelo (opcional, mas obrigatório se marca for introduzido, alfanumerico, 50 caracteres)<br>
			- número de série do fabricante (opcional, alfanumerico, 50 caracteres)<br>
			- breve descrição (opcional, alfanumerico, 250 caracteres)"<br>

>**Question**: "Relativamente à funcionalidade de criar elevador, no seguimento da sua resposta em (https://moodle.isep.ipp.pt/mod/forum/discuss.php?d=25298#p32051), gostaríamos que clarificasse quais das propriedades que indicou serem alfanuméricas podem conter espaços; por exemplo, nós acharíamos que seria sensato a descrição poder conter espaços."<br>
"Adicionalmente, gostaria de saber se o identificador numérico que referiu deve ser fornecido ao sistema ou gerado automaticamente pelo mesmo, dado que este deve ser único dentro de cada edifício."<br><br>
>**Answer**: "
bom dia,
todos os atributos alfanumercos podme conter espaços à exceção do número de série
o número indeitifcativo do elevador deve ser gerado sequencialmente pelo sistema tendo em conta o edifico, por exemplo, existirá o elevador 1 do edificio B e o elevador 1 do edificio A"<br>

**Dependencies:**
- **US150 -** As a Campus Manager, I want to create a building.

**Regarding this requirement we understand that:** <br>
As a Campus Manager, an actor of the system, I will be able to access the system and create a building in the Campus area.

## 3. Analysis

**Analyzing this User Story we understand that:**
* Campus Manager is a user role that manages the data of the routes and maps.
* Building is a structure within the campus that houses various rooms and facilities. It can be navigated by the robisep robots using corridors and elevators.

### 3.1. Domain Model Excerpt
![DomainModelExcerpt](Diagrams/DomainModelExcerpt.svg)

## 4. Design

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

### 4.2. Applied Patterns
* Controller
* Service
* Repository
* Mapper
* DTO
* GRASP


### 4.3. Tests

**Test 1:** *Tests the controller using a stub service to create a valid elevator*

```
it('Controller unit test with stub service, valid elevator', async function () {
        let body = {
            "elevatorId": 20,
            "elevatorBrand": "Apple",
            "elevatorIdentificationNumber": 35,
            "elevatorDescription": 'This is an elevator',
            "elevatorModel": 'Ieli',
            "elevatorSerialNumber": '445'
        }

        let expected = {
            "elevatorId": 20,
            "elevatorBrand": "Apple",
            "elevatorIdentificationNumber": 35,
            "elevatorDescription": 'This is an elevator',
            "elevatorModel": 'Ieli',
            "elevatorSerialNumber": '445'
        }

        let req: Partial<Request> = {}
        req.body = body

        let res: Partial<Response> = {
            json: sinon.spy()
        }

        let next: Partial<NextFunction> = () => { }

        let createElevatorService = Container.get('createElevatorService')
        sinon.stub(createElevatorService, 'createElevator').returns(Result.ok<IElevatorDTO>({
            elevatorId: 20,
            elevatorBrand: 'Apple',
            elevatorIdentificationNumber: 35,
            elevatorDescription: 'This is an elevator',
            elevatorModel: 'Ieli',
            elevatorSerialNumber: '445'
        } as IElevatorDTO))

        const createElevatorController = new CreateElevatorController(createElevatorService as ICreateElevatorService)

        await createElevatorController.createElevator(<Request>req, <Response>res, <NextFunction>next)

        sinon.assert.calledOnce(res.json)
        sinon.match(expected)
    })
````

**Test 2:** *Tests the elevator description over the max allowed word limit*

```
it('Create elevator test, elevator description over word limit (250+ words)', async function () {
        const elevatorDescription: string = 'A'.repeat(251);
        const result: Result<ElevatorDescription> = ElevatorDescription.create(elevatorDescription);

        assert.equal(result.isFailure,true)
        assert.equal(result.error,'Elevator description must be shorter than 250 words')
    })
````

## 5. Implementation

**createElevatorService:**

```
public async createElevator(elevatorDto: ICreateElevatorDTO): Promise<Result<IElevatorDTO>> {
try{
if (await this.elevatorRepo.findById(elevatorDto.elevatorId) !== null) return Result.fail<IElevatorDTO>('An Elevator with this Id already exists!')

            const building = await this.buildingRepo.findByBuidingCode(new BuildingCode(elevatorDto.buildingCode))
            if (!building) return Result.fail<IElevatorDTO>('Building does not exist!')

           let maxIdNum = 1

            for (var floor of building.floors) {
                for (var elevatorId of floor.props.floormap.elevatorsId){
                    const elevator = await this.elevatorRepo.findById(elevatorId)
                    if (maxIdNum <= elevator.props.elevatorIdentificationNumber.identificationNumber){
                        maxIdNum = elevator.props.elevatorIdentificationNumber.identificationNumber + 1
                    }
                }
            }

            let floors: Floor[] = [];
            for (var floorId of elevatorDto.floorIds) {
                const floor = await this.floorRepo.findById(floorId)
                if (floor === null) return Result.fail<IElevatorDTO>('Floor does not exist!')
                if (building.props.floors.find((floorInList) => floorInList.id.toValue() === floor.id.toValue()) === undefined){ return Result.fail<IElevatorDTO>('Floor with id ' + floor.floorId.toValue() + ' does not belong in building ' + building.code.toValue())}
                floors.push(floor)
            }

            if (elevatorDto.elevatorBrand !== undefined && elevatorDto.elevatorModel === undefined) return Result.fail<IElevatorDTO>('Brand was provided so Model is also required!')

            const elevatorOrError = await Elevator.create(
                {
                    elevatorIdentificationNumber: ElevatorIdentificationNumber.create(maxIdNum).getValue(),
                    elevatorBrand: ElevatorBrand.create(elevatorDto.elevatorBrand).getValue(),
                    elevatorDescription: ElevatorDescription.create(elevatorDto.elevatorDescription).getValue(),
                    elevatorModel: ElevatorModel.create(elevatorDto.elevatorModel).getValue(),
                    elevatorSerialNumber: ElevatorSerialNumber.create(elevatorDto.elevatorSerialNumber).getValue()
                }, ElevatorID.create(elevatorDto.elevatorId).getValue())


            if (elevatorOrError.isFailure) {
                return Result.fail<IElevatorDTO>(elevatorOrError.errorValue())
            }

            const elevatorResult = elevatorOrError.getValue();
            await this.elevatorRepo.save(elevatorResult);

            for (var floor of floors){
                floor.addElevators(elevatorResult)
                await this.floorRepo.save(floor);
            }

            const ElevatorDtoResult = ElevatorMap.toDto(elevatorResult) as IElevatorDTO

            return Result.ok<IElevatorDTO>(ElevatorDtoResult)

        } catch(e) {
            throw e
        }
    }
````

## 6. Integration/Demonstration

To use this US, you need to send and HTTP request with the following JSON:

Using this URI: localhost:4000/api/elevators/create

```
{
    "elevatorId": 5,
    "elevatorBrand": "Apple",
    "elevatorDescription": "um elevador",
    "elevatorModel": "iPhone",
    "elevatorSerialNumber": "string",
    "buildingCode": "A",
    "floorIds": [1]
}
```

## 7. Observations

No additional observations.
