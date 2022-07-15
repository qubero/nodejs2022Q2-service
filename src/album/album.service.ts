import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import InMemoryDB from 'src/db';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { Album } from './entities/album.entity';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AlbumService {
  private db = new InMemoryDB<Album>();

  create(createAlbumDto: CreateAlbumDto) {
    const albumData = {
      id: uuidv4(),
      ...createAlbumDto,
    };

    const newAlbum = new Album(albumData);

    return this.db.create(newAlbum);
  }

  findAll() {
    return this.db.findAll();
  }

  async findOne(id: string) {
    const album = await this.db.findOneById(id);

    if (!album) {
      throw new NotFoundException({
        statusCode: HttpStatus.NOT_FOUND,
        message: 'Album not found',
      });
    }

    return album;
  }

  async update(id: string, updateAlbumDto: UpdateAlbumDto) {
    const album = await this.findOne(id);

    const updateAlbum = new Album({
      ...album,
      ...updateAlbumDto,
    });

    return this.db.update(id, updateAlbum);
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.db.removeById(id);
  }
}
