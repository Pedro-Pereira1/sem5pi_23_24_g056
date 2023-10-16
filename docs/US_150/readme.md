# US 150 - As a Campus Manager, I want to create a building

## 1. Context

* First time that this task is developed.
* This task is relative to system user Campus Manager.

## 2. Requirements

**US 150 -** As a Campus Manager, I want to:

* Create a building

**Dependencies:**
There are no Dependencies associated with this US.

## 3. Analysis

Regarding this requirement we understand that as a Campus Manager, an actor of the system, I will be able to access the system and create a building in the Campus area. A building is a structure within the campus that houses various rooms, floors, elevators and may have passageways to other buildings, it can be navigated by the robisep robots using corridors and elevators.

### 3.1. Domain Model Excerpt

![DomainModelExcerpt](Diagrams/DomainModelExcerpt.svg)

### 3.2. System Sequence Diagram

![SystemSequenceDiagram](Diagrams/SystemSequenceDiagram.svg)

## 4. Design

### 4.1. Realization

![SequenceDiagram](Diagrams/SequenceDiagram.svg)

### 4.2. Class Diagram

![ClassDiagram](Diagrams/ClassDiagram.svg)

### 4.3. Applied Patterns

### 4.4. Tests

**Test 1:** *Verifies that is possible to create a building with the correct paramethers*

```javascript
test("Valid building", () => {

})
```

**Test 2:** *Verifies that is not possible to create a building with the wrong paramethers*

```javascript
test("Invalid building", () => {

})
```

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