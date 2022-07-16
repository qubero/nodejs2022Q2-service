import { Module } from '@nestjs/common';
import { AlbumService } from './album.service';
import { AlbumController } from './album.controller';
import { TrackService } from 'src/track/track.service';
import { FavouritesService } from 'src/favourites/favourites.service';
import { ArtistService } from 'src/artist/artist.service';

@Module({
  controllers: [AlbumController],
  providers: [AlbumService, TrackService, FavouritesService, ArtistService],
})
export class AlbumModule {}
