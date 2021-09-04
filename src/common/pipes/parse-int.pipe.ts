import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class ParseIntPipe implements PipeTransform {
  transform(value: string, metadata: ArgumentMetadata) {
    console.log('value', value)
    const val = parseInt(value, 10);
    console.log('val', val)
    if (isNaN(val)) {
      throw new BadRequestException(`Validation failed. ${val} is not integer.`);
    }
    return val;
  }
}
