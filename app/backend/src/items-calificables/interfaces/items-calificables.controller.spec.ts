import { Test, TestingModule } from '@nestjs/testing';
import { ItemsCalificablesController } from './items-calificables.controller';

describe('ItemsCalificablesController', () => {
  let controller: ItemsCalificablesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ItemsCalificablesController],
    }).compile();

    controller = module.get<ItemsCalificablesController>(ItemsCalificablesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
