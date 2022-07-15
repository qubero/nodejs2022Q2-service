import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { v4 as uuidv4 } from 'uuid';
import InMemoryDB from 'src/db';
import { Track } from './entities/track.entity';

@Injectable()
export class TrackService {
  private db = new InMemoryDB<Track>();

  create(createTrackDto: CreateTrackDto) {
    const trackData = {
      id: uuidv4(),
      ...createTrackDto,
    };

    const newTrack = new Track(trackData);

    return this.db.create(newTrack);
  }

  findAll() {
    return this.db.findAll();
  }

  async findOne(id: string) {
    const track = await this.db.findOneById(id);

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

    return this.db.update(id, updateTrack);
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.db.removeById(id);
  }
}
