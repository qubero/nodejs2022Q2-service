import {
  ForbiddenException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import InMemoryDB from 'src/db';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { Artist } from './entities/artist.entity';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class ArtistService {
  private db = new InMemoryDB<Artist>();

  create(createArtistDto: CreateArtistDto) {
    const artistData = {
      id: uuidv4(),
      ...createArtistDto,
    };

    const newArtist = new Artist(artistData);

    return this.db.create(newArtist);
  }

  findAll() {
    return this.db.findAll();
  }

  async findOne(id: string) {
    const artist = await this.db.findOneById(id);

    if (!artist) {
      throw new NotFoundException({
        statusCode: HttpStatus.NOT_FOUND,
        message: 'Artist not found',
      });
    }

    return artist;
  }

  async update(id: string, updateArtistDto: UpdateArtistDto) {
    const artist = await this.findOne(id);

    const updateArtist = new Artist({
      ...artist,
      ...updateArtistDto,
    });

    return this.db.update(id, updateArtist);
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.db.removeById(id);
  }
}
