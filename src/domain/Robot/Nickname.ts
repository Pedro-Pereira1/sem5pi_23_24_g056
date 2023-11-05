import { initial } from 'lodash';
import { ValueObject } from '../../core/domain/ValueObject';
import { Result } from '../../core/logic/Result';


interface NicknameProps {
  nickname: string;
}

export class Nickname extends ValueObject<NicknameProps> {

  private constructor(props: NicknameProps) {
    super(props);
  }

  public static create(nickname: NicknameProps): Result<Nickname> {
    if (nickname.nickname.length > 30) {
      return Result.fail<Nickname>('Nickname must be less than 30 characters');
    }

    return Result.ok<Nickname>(new Nickname({ nickname: nickname.nickname }));
  }

  get nickname(): string {
    return this.props.nickname;
  }
}

