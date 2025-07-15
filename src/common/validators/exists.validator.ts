import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments, ValidationOptions, registerDecorator } from 'class-validator';
import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';

@ValidatorConstraint({ name: 'Exists', async: true })
@Injectable()
export class ExistsValidator implements ValidatorConstraintInterface {
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource
  ) {}

  async validate(value: any, args: ValidationArguments) {
    const [entityName, column] = args.constraints;
    
    try {
      const repository = this.dataSource.getRepository(entityName);
      const record = await repository.findOne({
        where: { [column]: value }
      });
      return !!record;
    } catch (error) {
      return false;
    }
  }

  defaultMessage(args: ValidationArguments) {
    const [entityClass, column] = args.constraints;
    const entityName = entityClass.name.replace(/([A-Z])/g, ' $1').trim().toLowerCase();
    return `${entityName} with ${column} '${args.value}' does not exist`;
  }
}

export function Exists(entityName: any, column: string, validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'Exists',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [entityName, column],
      validator: ExistsValidator,
    });
  };
} 