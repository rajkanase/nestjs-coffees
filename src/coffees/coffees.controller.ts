import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  NotFoundException,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CoffeesService } from './coffees.service';
import { CreateCoffeeDto } from './dto/create-coffee.dto';
import { UpdateCoffeeDto } from './dto/update-coffee.dto';

@Controller('coffees')
export class CoffeesController {
  constructor(private readonly coffeeService: CoffeesService) {}

  @Get()
  findAll() {
    return this.coffeeService.findAll();
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    const coffee = this.coffeeService.findById(id);
    if (!coffee) {
      // throw new HttpException(`coffee #${id} not found.`, HttpStatus.NOT_FOUND);
      throw new NotFoundException(`coffee #${id} not found.`);
    }
    return coffee;
  }

  @Post()
  createCoffee(@Body() createCoffeeDto: CreateCoffeeDto) {
    return this.coffeeService.create(createCoffeeDto);
  }

  @Patch(':id')
  updateCoffee(
    @Param('id') id: string,
    @Body() updateCoffeeDto: UpdateCoffeeDto,
  ) {
    return this.coffeeService.update(id, updateCoffeeDto);
  }

  @Delete(':id')
  deleteCoffee(@Param('id') id: string) {
    return this.coffeeService.delete(id);
  }
}
