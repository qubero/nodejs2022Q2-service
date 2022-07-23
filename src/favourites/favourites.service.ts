import {
  forwardRef,
  Inject,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { AlbumService } from 'src/album/album.service';
import { ArtistService } from 'src/artist/artist.service';
import { TrackService } from 'src/track/track.service';
import { Favourite } from './entities/favourite.entity';

@Injectable()
export class FavouritesService {
  private static db: Favourite = {
    albums: [],
    artists: [],
    tracks: [],
  };

  constructor(
    @Inject(forwardRef(() => AlbumService))
    private albumService: AlbumService,
    @Inject(forwardRef(() => ArtistService))
    private artistService: ArtistService,
    @Inject(forwardRef(() => TrackService))
    private trackService: TrackService,
  ) {}

  async addArtist(id: string) {
    try {
      await this.artistService.findOne(id);

      const idx = FavouritesService.db.artists.findIndex(
        (artistId) => artistId === id,
      );

      if (idx === -1) {
        FavouritesService.db.artists.push(id);
      }
    } catch (e) {
      throw new UnprocessableEntityException();
    }
  }

  removeArtist(id: string) {
    const idx = FavouritesService.db.artists.findIndex(
      (artistId) => artistId === id,
    );

    return idx > -1 && FavouritesService.db.artists.splice(idx, 1);
  }

  async addAlbum(id: string) {
    try {
      await this.albumService.findOne(id);

      const idx = FavouritesService.db.albums.findIndex(
        (albumId) => albumId === id,
      );

      if (idx === -1) {
        FavouritesService.db.albums.push(id);
      }
    } catch (e) {
      throw new UnprocessableEntityException();
    }
  }

  removeAlbum(id: string) {
    const idx = FavouritesService.db.albums.findIndex(
      (albumId) => albumId === id,
    );

    return idx > -1 && FavouritesService.db.albums.splice(idx, 1);
  }

  async addTrack(id: string) {
    try {
      await this.trackService.findOne(id);

      const idx = FavouritesService.db.tracks.findIndex(
        (trackId) => trackId === id,
      );

      if (idx === -1) {
        FavouritesService.db.tracks.push(id);
      }
    } catch (e) {
      throw new UnprocessableEntityException();
    }
  }

  removeTrack(id: string) {
    const idx = FavouritesService.db.tracks.findIndex(
      (trackId) => trackId === id,
    );

    return idx > -1 && FavouritesService.db.tracks.splice(idx, 1);
  }

  async findAll() {
    return {
      artists: await Promise.all(
        FavouritesService.db.artists.map(async (artistId) =>
          this.artistService.findOne(artistId),
        ),
      ),
      albums: await Promise.all(
        FavouritesService.db.albums.map(async (albumId) =>
          this.albumService.findOne(albumId),
        ),
      ),
      tracks: await Promise.all(
        FavouritesService.db.tracks.map(async (trackId) =>
          this.trackService.findOne(trackId),
        ),
      ),
    };
  }
}
