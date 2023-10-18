import { initial } from 'lodash';
import { ValueObject } from '../../core/domain/ValueObject';

  
  interface NicknameProps {
    nickname: string;
  }

  export class Nickname extends ValueObject<NicknameProps> {

    private constructor (props : NicknameProps){
      super(props);
    }
    
  }
