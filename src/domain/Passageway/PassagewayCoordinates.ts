import { ValueObject } from '../../core/domain/ValueObject';
import { Result } from '../../core/logic/Result';

interface PassagewayCoordinatesProps {
  topX: number;
  topY: number;
  bottomX: number;
  bottomY: number;
  topXB2: number;
  topYB2: number;
  bottomXB2: number;
  bottomYB2: number;
}

export class PassagewayCoordinates extends ValueObject<PassagewayCoordinatesProps> {

  constructor(props: PassagewayCoordinatesProps) {
    super(props);
  }

  public static create(props: PassagewayCoordinatesProps,maxWidhtB1: number,maxLenghtB1: number,maxWidhtB2: number,maxLenghtB2: number): Result<PassagewayCoordinates> {
    if (props.topX < 0 || props.topY < 0 || 
      props.bottomX < 0 || props.bottomY < 0 || 
      props.topXB2 < 0 || props.topYB2 < 0 || 
      props.bottomXB2 < 0 || props.bottomYB2 < 0) {
      return Result.fail<PassagewayCoordinates>('Coordinates cannot be negative.');
    }

    var positionValidation = this.positionValidation(props,maxWidhtB1,maxLenghtB1,maxWidhtB2,maxLenghtB2); 

    if(positionValidation === false){
      return Result.fail<PassagewayCoordinates>('Invalid Position.');
    }

    return Result.ok<PassagewayCoordinates>(new PassagewayCoordinates(props));
  }


  public static positionValidation(props: PassagewayCoordinatesProps,maxWidhtB1: number,maxLenghtB1: number,maxWidhtB2: number,maxLenghtB2: number): boolean{

    if(props.topX === 0 && props.bottomX === 0){
      let x1 = this.validateN(props.topX,props.bottomX,props.topY,props.bottomY,maxWidhtB1);
      let x2 = this.validateS(props.topXB2,props.bottomXB2,props.topYB2,props.bottomYB2,maxWidhtB2,maxLenghtB2);
      return (x1 && x2)
    }else if(props.topX === maxLenghtB1-1 && props.bottomX === maxLenghtB1-1){
      let x1 = this.validateS(props.topX,props.bottomX,props.topY,props.bottomY,maxWidhtB1,maxLenghtB1);
      let x2 = this.validateN(props.topXB2,props.bottomXB2,props.topYB2,props.bottomYB2,maxWidhtB2);
      return (x1 && x2)
    }else if(props.topY === 0 && props.bottomY === 0){
      let x1 = this.validateE(props.topX,props.bottomX,props.topY,props.bottomY,maxLenghtB1);
      let x2 = this.validateW(props.topXB2,props.bottomXB2,props.topYB2,props.bottomYB2,maxWidhtB2,maxLenghtB2);
      return (x1 && x2)
    }else if(props.topY === maxWidhtB1-1 && props.bottomY === maxWidhtB1-1){
      let x1 = this.validateW(props.topX,props.bottomX,props.topY,props.bottomY,maxWidhtB1,maxLenghtB1);
      let x2 = this.validateE(props.topXB2,props.bottomXB2,props.topYB2,props.bottomYB2,maxLenghtB2);
      return (x1 && x2)
    }
    return false;
  }



  public static validateN(topX:number,bottomX: number,topY: number,bottomY:number,maxWidht: number): boolean{
    if(topX === 0 && bottomX === 0){
        if(bottomY - topY === 1){
            if(topY >= 0 && bottomY < maxWidht){
                return true;
            }
        }
    }
    return false;
  }

  public static validateS(topX:number,bottomX: number,topY: number,bottomY:number,maxWidht: number,maxLenght: number): boolean{
    
    if(topX === maxLenght-1 && bottomX === maxLenght-1){
        if(bottomY - topY === 1){
            if(topY >= 0 && bottomY < maxWidht){
                return true;
            }
        }
    }
    return false;
  }

  public static validateE(topX:number,bottomX: number,topY: number,bottomY:number,maxLenght: number): boolean{
    if(topY === 0 && bottomY === 0){
        if(bottomX - topX === 1){
            if(topX >= 0 && bottomX < maxLenght){
                return true;
            }
        }
    }
    return false;
  }

  public static validateW(topX:number,bottomX: number,topY: number,bottomY:number,maxWidht: number,maxLenght: number): boolean{
    if(topY === maxWidht-1 && bottomY === maxWidht-1){
        if(bottomX - topX === 1){
            if(topX >= 0 && bottomX < maxLenght){
                return true;
            }
        }
    }
    return false;
  }

}
