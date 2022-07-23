import {
  forwardRef,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { v4 as uuidv4 } from 'uuid';
import InMemoryDB from 'src/db';
import { Track } from './entities/track.entity';
import { FavouritesService } from 'src/favourites/favourites.service';

@Injectable()
export class TrackService {
  private static db = new InMemoryDB<Track>();

  constructor(
    @Inject(forwardRef(() => FavouritesService))
    private favouritesService: FavouritesService,
  ) {}

  create(createTrackDto: CreateTrackDto) {
    const trackData = {
      id: uuidv4(),
      ...createTrackDto,
    };

    const newTrack = new Track(trackData);

    return TrackService.db.create(newTrack);
  }

  findAll() {
    return TrackService.db.findAll();
  }

  async findOne(id: string) {
    const track = await TrackService.db.findOneById(id);

    if (!track) {
      throw new NotFoundException({
        statusCode: HttpStatus.NOT_FOUND,
        message: 'Track not found',
      });
    }

    return track;
  }

  async update(id: string, updateTrackDto: UpdateTrackDto) {
    const track = await this.findOne(id);

    const updateTrack = new Track({
      ...track,
      ...updateTrackDto,
    });

    return TrackService.db.update(id, updateTrack);
  }

  async remove(id: string) {
    await this.findOne(id);

    this.favouritesService.removeTrack(id);

    return TrackService.db.removeById(id);
  }
}
