export type Attendance = 'yes' | 'no';
export type BusOption = 'round_trip' | 'only_go' | 'only_return' | 'no_bus';
export type FoodPreference = 'none' | 'vegetarian' | 'vegan';

export interface Companion {
  fullName: string;
}

export interface RsvpResponse {
  _id?: string;
  fullName: string;
  attendance: Attendance;
  companionsCount: number;
  companions: Companion[];
  busOption: BusOption;
  allergies: string;
  foodPreference: FoodPreference;
  mustPlaySong: string;
  createdAt?: string;
}
