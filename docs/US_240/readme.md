# US 240 - As a Campus Manager, I want to create a passageway between buildings.

## 1. Context

* First time that this task is developed.
* This task is relative to system user Campus Manager.

## 2. Requirements

**US 240 -** As a Campus Manager, I want to:

* Create a passageway between buildings

**Dependencies:**
There are no Dependencies associated with this US.

## 3. Analysis

Regarding this requirement we understand that as a Campus Manager, an actor of the system, 
I will be able to access the system and create a passageway choosing the 2 buildings in the Campus area.
A passageway is defined by 4 coordinates, 2 for each building, and its ID.

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

![Process](./Diagrams/Level3/ProcessLevel3.svg)

![a class diagram](class-diagram-01.svg "A Class Diagram")

### 4.2. Applied Patterns

### 4.3. Tests

**Test 1:** *Verifies that it is not possible to create an instance of the Example class with null values.*

```
@Test(expected = IllegalArgumentException.class)
public void ensureNullIsNotAllowed() {
	Example instance = new Example(null, null);
}
````

## 5. Implementation

*In this section the team should present, if necessary, some evidencies that the implementation is according to the design. It should also describe and explain other important artifacts necessary to fully understand the implementation like, for instance, configuration files.*

*It is also a best practice to include a listing (with a brief summary) of the major commits regarding this requirement.*

## 6. Integration/Demonstration

## 7. Observations