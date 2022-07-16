import {
  forwardRef,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import InMemoryDB from 'src/db';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { Artist } from './entities/artist.entity';
import { v4 as uuidv4 } from 'uuid';
import { TrackService } from 'src/track/track.service';
import { AlbumService } from 'src/album/album.service';
import { FavouritesService } from 'src/favourites/favourites.service';

@Injectable()
export class ArtistService {
  private static db = new InMemoryDB<Artist>();

  constructor(
    @Inject(forwardRef(() => TrackService))
    private trackService: TrackService,
    @Inject(forwardRef(() => AlbumService))
    private albumService: AlbumService,
    @Inject(forwardRef(() => FavouritesService))
    private favouritesService: FavouritesService,
  ) {}

  create(createArtistDto: CreateArtistDto) {
    const artistData = {
      id: uuidv4(),
      ...createArtistDto,
    };

    const newArtist = new Artist(artistData);

    return ArtistService.db.create(newArtist);
  }

  findAll() {
    return ArtistService.db.findAll();
  }

  async findOne(id: string) {
    const artist = await ArtistService.db.findOneById(id);

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

    return ArtistService.db.update(id, updateArtist);
  }

  async remove(id: string) {
    await this.findOne(id);

    for (const track of await this.trackService.findAll()) {
      if (track.artistId === id) {
        this.trackService.update(track.id, { artistId: null });
        break;
      }
    }

    for (const album of await this.albumService.findAll()) {
      if (album.artistId === id) {
        this.albumService.update(album.id, { artistId: null });
        break;
      }
    }

    this.favouritesService.removeArtist(id);

    return ArtistService.db.removeById(id);
  }
}
