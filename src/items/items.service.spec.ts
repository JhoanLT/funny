import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { ItemsService } from './items.service';
import { Item } from './schemas/item.schema';
import { NotFoundException } from '@nestjs/common';

describe('ItemsService', () => {
  let service: ItemsService;
  let model: any;

  beforeEach(async () => {
    const modelMock: any = jest.fn();

    modelMock.find = jest.fn().mockReturnThis();
    modelMock.sort = jest.fn().mockReturnThis();
    modelMock.exec = jest.fn();

    modelMock.findById = jest.fn().mockReturnThis();
    modelMock.findByIdAndUpdate = jest.fn();
    modelMock.findByIdAndDelete = jest.fn();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ItemsService,
        {
          provide: getModelToken(Item.name),
          useValue: modelMock,
        },
      ],
    }).compile();

    service = module.get<ItemsService>(ItemsService);
    model = module.get(getModelToken(Item.name));
  });

  it('debería devolver todos los items ordenados por createdAt desc', async () => {
    const result = [{ name: 'A' }, { name: 'B' }];
    model.exec.mockResolvedValue(result);

    const items = await service.findAll();

    expect(model.find).toHaveBeenCalled();
    expect(model.sort).toHaveBeenCalledWith({ createdAt: -1 });
    expect(items).toEqual(result);
  });

  it('debería devolver un item por id', async () => {
    const result = { _id: '1', name: 'One' };
    model.exec.mockResolvedValue(result);

    const item = await service.findOne('1');

    expect(model.findById).toHaveBeenCalledWith('1');
    expect(item).toEqual(result);
  });

  it('debería crear un item', async () => {
    const dto = { name: 'Nuevo', description: 'desc' };
    const saved = { _id: '123', ...dto };

    const saveMock = jest.fn().mockResolvedValue(saved);
    model.mockImplementation(() => ({ save: saveMock }));

    const result = await service.create(dto);

    expect(model).toHaveBeenCalledWith(dto);
    expect(saveMock).toHaveBeenCalled();
    expect(result).toEqual(saved);
  });

  it('debería actualizar un item existente', async () => {
    const dto = { name: 'Editado' };
    const updated = { _id: '1', name: 'Editado' };

    model.findByIdAndUpdate.mockResolvedValue(updated);

    const result = await service.update('1', dto);

    expect(model.findByIdAndUpdate).toHaveBeenCalledWith('1', dto, { new: true });
    expect(result).toEqual(updated);
  });

  it('debería lanzar NotFoundException al actualizar un item inexistente', async () => {
    const dto = { name: 'No existe' };
    model.findByIdAndUpdate.mockResolvedValue(null);

    await expect(service.update('1', dto)).rejects.toBeInstanceOf(NotFoundException);
  });

  it('debería eliminar un item existente', async () => {
    const existing = { _id: '1', name: 'X' };
    model.findByIdAndDelete.mockResolvedValue(existing);

    const result = await service.remove('1');

    expect(model.findByIdAndDelete).toHaveBeenCalledWith('1');
    expect(result).toEqual({ ok: true });
  });

  it('debería lanzar NotFoundException al eliminar un item inexistente', async () => {
    model.findByIdAndDelete.mockResolvedValue(null);

    await expect(service.remove('1')).rejects.toBeInstanceOf(NotFoundException);
  });
});