# US 190 - As a Campus Manager, I want to create building floor

## 1. Context

* First time that this task is developed.
* This task is relative to system user Fleet Manager .

## 2. Requirements

**US 190 -** As a Campus Manager, I want to create building floor

> **Q**: Será possível esclarecer como funcionarão estas user stories??
>
> **A**: O requisito 190 Criar piso permite definir um piso para um dos edificios criados anteriormente, por exemplo, o piso 1 do edificio B com uma breve descrição (ex., "salas TP".

**Dependencies:**

* **US150 -** As a Campus Manager, I want to create a building.

**Regarding this requirement we understand that:**

As a Campus Manager, an actor of the system, I will be able to access the system and create building floor.

## 3. Analysis

**Analyzing this User Story we understand that:**

* Campus Manager is a user role that manages the data of the routes and maps.
* Building is a structure within the campus that houses various rooms and facilities. It can be navigated by the robisep robots using corridors and elevators.
* Floor is a level within a building. Each floor can contain multiple rooms and is accessible by elevators and stairs (though robisep robots cannot use stairs).
* The floor information is based on: Floor Number, Floor Description and each floor coordinate info(wall,door,elevator,etc)
* Floor example:

|  O,N   |  N  |  N  |  N  |  N  | O,N |  N  |  N  |  O  |
|:------:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
|   O    |     |     |     |     |  O  |     |     |  O  |
|  N,PA  |  N  |  N  | N,P |  N  |  N  | N,P |  N  |  E  |
|   PA   |     |     |     |     |     |     |     |  E  |
|  O,N   |  N  |  N  |  N  |  N  |  N  | O,P |     |  O  |
|   O    |     |     |     |     |     |  O  |     | PA  |
|   O    |     |     |     |     |     |  O  |     | PA  |
|   N    |  N  |  N  |  N  |  N  |  N  |  N  |  N  |     |

* "O" means west wall, "N" means north wall, "P" means door, "PA" means passageway and "E" means elevator.

### 3.1. Domain Model Excerpt

![DomainModelExcerpt](Diagrams/DomainModelExcerpt.svg)

### 3.2. System Sequence Diagram

![SystemSequenceDiagram](Diagrams/SystemSequenceDiagram.svg)

## 4. Design

### 4.1. Realization

Level 2:

![SequenceDiagram](Diagrams/SequenceDiagramLevel2.svg)

Level 3:

In order to resolve this US we will make use of the folliwing classes:

1. CreateFloorController
2. CreateFloorService
3. FloorRepo
4. FloorMap
5. FloorDto
6. Floor
7. Building
8. BuildingMap
9. BuildingRepo

We will make also use of CreateFloorRoute file, inside this file we will put our route for any post request regarding the floor creation

![SequenceDiagram](Diagrams/SequenceDiagramLevel3.svg)

### 4.2. Class Diagram

![ClassDiagram](Diagrams/ClassDiagram.svg)

### 4.3. Applied Patterns

* Controller
* Repository
* Service
* Dto
* Mapper

### 4.4. Tests

```javascript
it('floor create valid test', async function {

})
```

```javascript
it('floor create invalid test', async function {

})
```

```javascript
it('controller unit test with stud service', async function {

})
```

```javascript
it('service unit test with stud repo', async function {

})
```

```javascript
it('controller + service + repo test with stud database', async function {

})
```

## 5. Implementation

## 6. Integration/Demonstration

## 7. Observations
