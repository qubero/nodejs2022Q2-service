export class Favourite {
  artists: string[];
  albums: string[];
  tracks: string[];

  constructor(partial: Partial<Favourite>) {
    Object.assign(this, partial);
  }
}
