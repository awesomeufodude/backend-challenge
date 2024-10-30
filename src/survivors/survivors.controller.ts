import { Body, Controller, Delete, Get, NotFoundException, Param, ParseIntPipe, Post, Put, UseGuards } from '@nestjs/common';
import { SurvivorsService } from './survivors.service';
import { CreateSurvivorDto } from './dto/create-survivor.dto';
import { UpdateSurvivorDto } from './dto/update-survivor.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('survivors')
export class SurvivorsController {
  constructor(private survivorsService: SurvivorsService) {}

  @Get()
  async getAllSurvivors() {
    return this.survivorsService.findAll();
  }

  @Post()
  async create(@Body() createSurvivorDto: CreateSurvivorDto) {
    return this.survivorsService.create(createSurvivorDto);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const survivor = await this.survivorsService.findOne(id);
    if (!survivor) {
      throw new NotFoundException(`Survivor with ID ${id} not found`);
    }
    return this.survivorsService.findOne(id);
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateSurvivorDto: UpdateSurvivorDto,
  ) {
    const survivor = await this.survivorsService.findOne(id);
    if (!survivor) {
      throw new NotFoundException(`Survivor with ID ${id} not found`);
    }
    return this.survivorsService.update(id, updateSurvivorDto);
  }

  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    const survivor = await this.survivorsService.findOne(id);
    if (!survivor) {
      throw new NotFoundException(`Survivor with ID ${id} not found`);
    }
    return this.survivorsService.delete(id);
  }
}
