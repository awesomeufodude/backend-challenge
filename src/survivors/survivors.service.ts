import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma.service';
import { CreateSurvivorDto } from './dto/create-survivor.dto';
import { UpdateSurvivorDto } from './dto/update-survivor.dto';

@Injectable()
export class SurvivorsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.survivor.findMany();
  }

  async create(createSurvivorDto: CreateSurvivorDto) {
    // Create the survivor in the database
    return this.prisma.survivor.create({
      data: createSurvivorDto,
    });
  }

  async findOne(id: number) {
    const survivor = await this.prisma.survivor.findUnique({ where: { id } });
    if (!survivor) {
      throw new NotFoundException(`Survivor with ID ${id} not found`);
    }
    return this.prisma.survivor.findUnique({
      where: { id },
    });
  }

  async update(id: number, updateSurvivorDto: UpdateSurvivorDto) {
    // First, check if the survivor exists
    const survivor = await this.prisma.survivor.findUnique({ where: { id } });
    if (!survivor) {
      throw new NotFoundException(`Survivor with ID ${id} not found`);
    }
    return this.prisma.survivor.update({
      where: { id },
      data: updateSurvivorDto,
    });
  }

  async delete(id: number) {
    // First, check if the survivor exists
    const survivor = await this.prisma.survivor.findUnique({ where: { id } });
    if (!survivor) {
      throw new NotFoundException(`Survivor with ID ${id} not found`);
    }

    // If the survivor exists, delete it
    return this.prisma.survivor.delete({
      where: { id },
    });
  }
}
