import {
  forwardRef,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import InMemoryDB from 'src/db';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { Album } from './entities/album.entity';
import { v4 as uuidv4 } from 'uuid';
import { TrackService } from 'src/track/track.service';
import { FavouritesService } from 'src/favourites/favourites.service';

@Injectable()
export class AlbumService {
  private static db = new InMemoryDB<Album>();

  constructor(
    @Inject(forwardRef(() => TrackService))
    private trackService: TrackService,
    @Inject(forwardRef(() => FavouritesService))
    private favouritesService: FavouritesService,
  ) {}

  create(createAlbumDto: CreateAlbumDto) {
    const albumData = {
      id: uuidv4(),
      ...createAlbumDto,
    };

    const newAlbum = new Album(albumData);

    return AlbumService.db.create(newAlbum);
  }

  findAll() {
    return AlbumService.db.findAll();
  }

  async findOne(id: string) {
    const album = await AlbumService.db.findOneById(id);

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

    return AlbumService.db.update(id, updateAlbum);
  }

  async remove(id: string) {
    await this.findOne(id);

    for (const track of await this.trackService.findAll()) {
      if (track.albumId === id) {
        this.trackService.update(track.id, { albumId: null });
        break;
      }
    }

    this.favouritesService.removeAlbum(id);

    return AlbumService.db.removeById(id);
  }
}
