import { Test, TestingModule } from '@nestjs/testing';
import { ItemsCalificablesService } from './items-calificables.service';

describe('ItemsCalificablesService', () => {
  let service: ItemsCalificablesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ItemsCalificablesService],
    }).compile();

    service = module.get<ItemsCalificablesService>(ItemsCalificablesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
