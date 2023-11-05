import { ValueObject } from '../../core/domain/ValueObject';
import { UniqueEntityID } from "../../core/domain/UniqueEntityID";
import { Result } from '../../core/logic/Result';

export class Code extends UniqueEntityID {

  constructor(code: string) {
    super(code)
  }

  public static create(code: string): Result<Code> {
    if (code === undefined || code === null || code.length > 0) {
      return Result.fail<Code>('Invalid code')
    }
    return Result.ok<Code>(new Code(code))
  }
}