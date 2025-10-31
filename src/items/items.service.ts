import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Item, ItemDocument } from './schemas/item.schema';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';

@Injectable()
export class ItemsService {
  constructor(@InjectModel(Item.name) private itemModel: Model<ItemDocument>) {}

  findAll() {
    return this.itemModel.find().sort({ createdAt: -1 }).exec();
  }

  findOne(id: string) {
    return this.itemModel.findById(id).exec();
  }

  async create(dto: CreateItemDto) {
    const created = new this.itemModel(dto);
    return created.save();
  }

  async update(id: string, dto: UpdateItemDto) {
    const updated = await this.itemModel.findByIdAndUpdate(id, dto, { new: true });
    if (!updated) throw new NotFoundException('Item not found');
    return updated;
  }

  async remove(id: string) {
    const res = await this.itemModel.findByIdAndDelete(id);
    if (!res) throw new NotFoundException('Item not found');
    return { ok: true };
  }
}