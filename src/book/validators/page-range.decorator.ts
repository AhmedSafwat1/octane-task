import { ValidationOptions, registerDecorator } from 'class-validator';
import { IsInBookPageRangeValidator } from './page-range.validator';

export function IsInBookPageRange(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string): void {
    registerDecorator({
      name: 'IsInBookPageRange',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsInBookPageRangeValidator,
    });
  };
}
