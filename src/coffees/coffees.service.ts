import { Injectable } from '@nestjs/common';
import { Coffee } from './entities/coffee.entity';

@Injectable()
export class CoffeesService {
  private coffees: Coffee[] = [
    {
      id: 1,
      name: 'Shivprasad Roast',
      brand: 'Buddy Brew',
      flavors: ['Vanilla', 'Chocolate'],
    },
  ];

  getIndex(id: string): number {
    return this.coffees.findIndex((itm) => itm.id === +id);
  }

  findAll(): Coffee[] {
    return this.coffees;
  }

  findById(id: string): Coffee {
    return this.coffees.find((e) => e.id === +id);
  }

  create(body: Coffee) {
    this.coffees.push(body);
  }

  update(id: string, body: any) {
    const ind = this.getIndex(id);
    this.coffees[ind].name = body.name;
    this.coffees[ind].brand = body.brand;
    this.coffees[ind].flavors = body.flavors;
  }

  delete(id: string) {
    const ind = this.getIndex(id);
    this.coffees.splice(ind, 1);
  }
}
