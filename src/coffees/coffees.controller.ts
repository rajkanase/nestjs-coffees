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
  Query,
} from '@nestjs/common';
import { Protocol } from 'src/common/decorators/protocol.decorators';
import { Public } from 'src/common/decorators/public.decorator';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { ParseIntPipe } from 'src/common/pipes/parse-int.pipe';
import { CoffeesService } from './coffees.service';
import { CreateCoffeeDto } from './dto/create-coffee.dto';
import { UpdateCoffeeDto } from './dto/update-coffee.dto';

@Controller('coffees')
export class CoffeesController {
  constructor(private readonly coffeeService: CoffeesService) { }

  @Public()
  @Get()
  async findAll(
    @Protocol('https') protocol: string,
    @Query() paginationQuery: PaginationQueryDto) {
    console.log(protocol);
    // await new Promise(resolve => setTimeout(resolve, 5000));
    return this.coffeeService.findAll(paginationQuery);
  }

  @Get(':id')
  findById(@Param('id', ParseIntPipe) id: string) {
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
