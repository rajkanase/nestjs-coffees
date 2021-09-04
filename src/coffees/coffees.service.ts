import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Event } from 'src/events/entities/event.entity';
import { Connection, Repository } from 'typeorm';
import { COFFEE_BRANDS } from './coffees.constants';
import { CreateCoffeeDto } from './dto/create-coffee.dto';
import { UpdateCoffeeDto } from './dto/update-coffee.dto';
import { Coffee } from './entities/coffee.entity';
import { Flavour } from './entities/flavour.entity';

@Injectable()
export class CoffeesService {
  constructor(
    @InjectRepository(Coffee)
    private readonly coffeeRepo: Repository<Coffee>,

    @InjectRepository(Flavour)
    private readonly flavorRepo: Repository<Flavour>,

    private readonly connection: Connection,
    @Inject(COFFEE_BRANDS) coffeeBrands: string[]
  ) {
    console.log(coffeeBrands);
  }

  findAll({ limit, offset }): Promise<Coffee[]> {
    return this.coffeeRepo.find({
      relations: ['flavors'],
      skip: offset,
      take: limit,
    });
  }

  async findById(id: string): Promise<Coffee> {
    const coffee = await this.coffeeRepo.findOne(id, {
      relations: ['flavors'],
    });
    if (!coffee) {
      throw new NotFoundException(`coffee #${id} not found.`);
    }
    return coffee;
  }

  async create(createCoffeeDto: CreateCoffeeDto) {
    const flavors = await Promise.all(
      createCoffeeDto.flavors.map((name) => this.createFlavorsByName(name)),
    );
    console.log('flavors', flavors);
    const coffee = this.coffeeRepo.create({
      ...createCoffeeDto,
      flavors,
    });
    return this.coffeeRepo.save(coffee);
  }

  async update(id: string, updateCoffeeDto: UpdateCoffeeDto) {
    const flavors =
      updateCoffeeDto.flavors &&
      (await Promise.all(
        updateCoffeeDto.flavors.map((name) => this.createFlavorsByName(name)),
      ));
    const coffee = await this.coffeeRepo.preload({
      id: +id,
      ...updateCoffeeDto,
      flavors,
    });
    if (!coffee) {
      throw new NotFoundException(`coffee #${id} not found.`);
    }
    return this.coffeeRepo.save(coffee);
  }

  async delete(id: string) {
    const coffee = await this.findById(id);
    return this.coffeeRepo.remove(coffee);
  }

  private async createFlavorsByName(name: string): Promise<Flavour> {
    const flvr = await this.flavorRepo.findOne({ name });
    console.log('flvr', flvr);
    if (flvr) {
      return flvr;
    }
    return this.flavorRepo.create({ name });
  }

  async recommendCoffee(coffee: Coffee) {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      coffee.recommendations++;

      const recommendedEvent = new Event();
      recommendedEvent.name = 'recommend_coffee';
      recommendedEvent.type = 'coffee';
      recommendedEvent.payload = { coffeeId: coffee.id };

      await queryRunner.manager.save(coffee);
      await queryRunner.manager.save(recommendedEvent);

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }
}
