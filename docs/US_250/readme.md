# US 250 - As a Campus Manager, I want to edit the passageway between buildings.

## 1. Context

* First time that this task is developed.
* This task is relative to system user Campus Manager.

## 2. Requirements

**US 250 -** As a Campus Manager, I want to:

* Edit a passageway between buildings

**Client Clarifications**
> **Q**: ... o que é que pretende que seja possivel editar numa passagem entre edificios?
<br>
> **A**: ... deve ser possivel corrigir todos os dados da passagem.
<br>
> **Q**: ... o que pretende indicar no que se refere à passagem entre edifícios? Seria apenas os edifícios e os pisos referentes à mesma, ou deve ser dito mais alguma coisa acerca de uma passagem?
<br>
> **A**: ... apenas os edificios e os pisos que estão ligados por essa passagem.

**Dependencies:**
- **US150 -** As a Campus Manager, I want to create a building.
- **US190 -** As a Campus Manager, I want to create building floor.
- **US240 -** As a Campus Manager, I want to create a passageway between buildings.

## 3. Analysis

Regarding this requirement we understand that: As a Campus Manager, an actor of the system, I will be able to edit a passageway
between buildings, changing the points where it connects to.
* Campus Manager is a user role that manages the data of the routes and maps.
* Building is a structure within the campus that houses various rooms and facilities. It can be navigated by the robisep robots using corridors and elevators.
* Floor is a level within a building. Each floor can contain multiple rooms and is accessible by elevators and stairs (though robisep robots cannot use stairs).
* Passageway is a connection between two buildings.

### 3.1. Domain Model Excerpt

![DomainModelExcerpt](./Diagrams/DomainModelExcerpt.svg)

## 4. Design

### 4.1. Realization

### Level 1

* Logical:

![Logical](./Diagrams/Level1/LogicalView.svg)

* Process

![Process](./Diagrams/Level1/ProcessLevel1.svg)

* Scenary

![Scenary](./Diagrams/Level1/scenaryLevel1.svg)

### level 2

* Logical:

![Logical](./Diagrams/Level2/LogicalViewLevel2.svg)

* Process

![Process](./Diagrams/Level2/ProcessLevel2.svg)

* Physical

![physical](./Diagrams/Level2/PhysicalViewLevel2.svg)

* Implementation

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

**Test 1:** *Verifies that it is not possible to create an instance of the Example class with null values.*

```
@Test(expected = IllegalArgumentException.class)
public void ensureNullIsNotAllowed() {
	Example instance = new Example(null, null);
}
````

## 5. Implementation

**EditPassagewayService:**

```
public async editPassageway(passagewayDTO:IEditPassagewayDTO): Promise<Result<IPassagewayDTO>> {
        try{
            const passageway = await this.passagewayRepo.findById(passagewayDTO.passagewayId)

            if (passageway === undefined) throw new Error("Passageway does not exist!")

            const currentFloors : Floor[] = await this.floorRepo.findByPassageway(Number(passageway.id.toValue()))

            const floor1 = await this.floorRepo.findById(passagewayDTO.floor1Id)
            const floor2 = await this.floorRepo.findById(passagewayDTO.floor2Id)
            let index = 0
            let isFloor1 = false
            let isFloor2 = false


            for(var floor of currentFloors){
                if(floor.floorId.toValue() !== floor1.floorId.toValue() && floor.floorId.toValue() !== floor2.floorId.toValue()) {
                    floor.removePassageway(passageway)
                    await this.floorRepo.save(floor);
                    index++
                }else if (floor.floorId.toValue() !== floor1.floorId.toValue()){
                    isFloor2 = true
                }else{
                    isFloor1 = true
                }
            }

            if(isFloor1 && index>0){
                floor2.addPassageway(passageway)
            }else if(isFloor2 && index > 0){
                floor1.addPassageway(passageway)
            } else if(index>0){
                floor1.addPassageway(passageway)
                floor2.addPassageway(passageway)
            }

            await this.floorRepo.save(floor1);
            await this.floorRepo.save(floor2);

            const passagewayDtoResult = PassagewayMap.toDto(passageway) as IPassagewayDTO

            return Result.ok<IPassagewayDTO>(passagewayDtoResult)

        } catch(e) {
            throw e
        }
    }
````

## 6. Integration/Demonstration

## 7. Observations

No additional observations.