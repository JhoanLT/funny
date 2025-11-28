import { Test, TestingModule } from '@nestjs/testing';
import { ItemsController } from './items.controller';
import { ItemsService } from './items.service';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';

describe('ItemsController', () => {
  let controller: ItemsController;
  let service: jest.Mocked<ItemsService>;

  beforeEach(async () => {
    const serviceMock: Partial<jest.Mocked<ItemsService>> = {
      findAll: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ItemsController],
      providers: [
        {
          provide: ItemsService,
          useValue: serviceMock,
        },
      ],
    }).compile();

    controller = module.get<ItemsController>(ItemsController);
    service = module.get(ItemsService) as jest.Mocked<ItemsService>;
  });

  it('debería delegar en service.findAll()', async () => {
    const data = [{ _id: '1', name: 'A' }];
    service.findAll.mockResolvedValue(data as any);

    const result = await controller.findAll();

    expect(service.findAll).toHaveBeenCalled();
    expect(result).toBe(data);
  });

  it('debería delegar en service.findOne()', async () => {
    const data = { _id: '1', name: 'A' };
    service.findOne.mockResolvedValue(data as any);

    const result = await controller.findOne('1');

    expect(service.findOne).toHaveBeenCalledWith('1');
    expect(result).toBe(data);
  });

  it('debería delegar en service.create()', async () => {
    const dto: CreateItemDto = { name: 'Nuevo', description: 'desc' };
    const created = { _id: '1', ...dto };
    service.create.mockResolvedValue(created as any);

    const result = await controller.create(dto);

    expect(service.create).toHaveBeenCalledWith(dto);
    expect(result).toBe(created);
  });

  it('debería delegar en service.update()', async () => {
    const dto: UpdateItemDto = { name: 'Editado' };
    const updated = { _id: '1', name: 'Editado' };
    service.update.mockResolvedValue(updated as any);

    const result = await controller.update('1', dto);

    expect(service.update).toHaveBeenCalledWith('1', dto);
    expect(result).toBe(updated);
  });

  it('debería delegar en service.remove()', async () => {
    const response = { ok: true };
    service.remove.mockResolvedValue(response as any);

    const result = await controller.remove('1');

    expect(service.remove).toHaveBeenCalledWith('1');
    expect(result).toBe(response);
  });
});
