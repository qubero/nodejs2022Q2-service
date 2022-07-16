import { Module } from '@nestjs/common';
import { TrackService } from './track.service';
import { TrackController } from './track.controller';
import { FavouritesService } from 'src/favourites/favourites.service';
import { AlbumService } from 'src/album/album.service';
import { ArtistService } from 'src/artist/artist.service';

@Module({
  controllers: [TrackController],
  providers: [TrackService, AlbumService, ArtistService, FavouritesService],
})
export class TrackModule {}
