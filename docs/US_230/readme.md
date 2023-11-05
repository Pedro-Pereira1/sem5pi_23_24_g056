# US 230 As a Campus Manager I want to load the map of a floor

## 1. Context

* First time that this task is developed.
* This task is relative to system user Campus Manager.

## 2. Requirements

**US 230 -** As a Campus Manager, I want to:

* Load a map of a floor

**Dependencies:**
There are no Dependencies associated with this US.

## 3. Analysis

Regarding this requirement we understand that as a Campus Manager, an actor of the system, I will be able to access
the system and load a map of a floor to the system and persist it, the map of the floor will be a simple text file
which contains the layout of the floor as a series of characters

An example of the text file

| Map layout | North wall | West wall | Door | Elevator | Passageway |
|:----------:|:----------:|:---------:|:----:|:--------:|:----------:|
|     0      |     No     |    No     |  No  |    No    |     No     |
|     1      |     No     |    Yes    |  No  |    No    |     No     |
|     2      |    Yes     |    No     |  No  |    No    |     No     |
|     3      |    Yes     |    Yes    |  No  |    No    |     No     |
|     4      |     No     |    No     | Yes  |    No    |     No     |
|     5      |     No     |    No     |  No  |   yes    |     No     |
|     6      |     No     |    No     |  No  |    No    |    Yes     |

3, 2, 2, 2, 2, 3, 2, 2, 1

1, 0, 0, 0, 0, 1, 0, 0, 1

2, 2, 2, 0, 2, 2, 0, 2, 0

0, 0, 0, 0, 0, 0, 0, 0, 0

3, 2, 2, 2, 2, 2, 0, 0, 1

1, 0, 0, 0, 0, 0, 1, 0, 0

1, 0, 0, 0, 0, 0, 1, 0, 0

2, 2, 2, 2, 2, 2, 2, 2, 0

## 4. Design

### 4.1. Realization

### Level 1

* Logical:

![Logical](./Diagrams/Level1/logicalLevel1.svg)

* Process

![Process](./Diagrams/Level1/ProcessLevel1.svg)

* Scenary

![Scenary](./Diagrams/Level1/scenaryLevel1.svg)

### level 2

* Logical:

![Logical](./Diagrams/Level2/logicalLevel2.svg)

* Process

![Process](./Diagrams/Level2/ProcessLevel2.svg)

* Physical

![physical](./Diagrams/Level2/PhysicalLevel2.svg)

* Implementation

![Implementation](./Diagrams/Level2/ProcessLevel2.svg)

### Level 3

* Logical:

![Logical](./Diagrams/Level3/logicalLevel3.svg)

* Process

![Process](./Diagrams/Level3/ProcessViewLevel3.svg)

* Implementation

![Implementation](./Diagrams/Level3/ProcessLevel3.svg)

### 4.2. Applied Patterns

* Controller
* Service
* Repository
* Mapper
* Dto

### 4.3. Tests

## 5. Implementation

*In this section the team should present, if necessary, some evidencies that the implementation is according to the design. It should also describe and explain other important artifacts necessary to fully understand the implementation like, for instance, configuration files.*

*It is also a best practice to include a listing (with a brief summary) of the major commits regarding this requirement.*

## 6. Integration/Demonstration

## 7. Observations
