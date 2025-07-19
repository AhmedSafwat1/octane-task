import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
  ValidationOptions,
  registerDecorator,
} from 'class-validator';
import { Injectable } from '@nestjs/common';
import { DataSource, EntityTarget, ObjectLiteral } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';

@ValidatorConstraint({ name: 'Exists', async: true })
@Injectable()
export class ExistsValidator implements ValidatorConstraintInterface {
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}

  async validate(value: unknown, args: ValidationArguments): Promise<boolean> {
    const [EntityClass, column] = args.constraints as [
      EntityTarget<ObjectLiteral>,
      string,
    ];

    try {
      const repository = this.dataSource.getRepository(EntityClass);
      const record = await repository.findOne({
        where: { [column]: value },
      });
      return !!record;
    } catch {
      return false;
    }
  }

  defaultMessage(args: ValidationArguments): string {
    const [EntityClass, column] = args.constraints as [
      EntityTarget<ObjectLiteral>,
      string,
    ];
    const entityName = (EntityClass as { name: string }).name
      .replace(/([A-Z])/g, ' $1')
      .trim()
      .toLowerCase();
    return `${entityName} with ${column} '${args.value}' does not exist`;
  }
}

export function Exists<T extends ObjectLiteral>(
  entityClass: EntityTarget<T>,
  column: keyof T & string,
  validationOptions?: ValidationOptions,
) {
  return function (object: object, propertyName: string): void {
    registerDecorator({
      name: 'Exists',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [entityClass, column],
      validator: ExistsValidator,
    });
  };
}
