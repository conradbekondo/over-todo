import { JwtPayload } from 'jwt-decode';
import { z } from 'zod';
import {
  CredentialSignInSchema,
  CredentialSignUpSchema,
  NewTaskSchema,
  PreferencesSchema,
  TaskSchema,
} from './schemas';

export type TimeOfDay = 'morning' | 'night' | 'afternoon' | 'evening';
export type WeatherInfo = {
  location: Location;
  current: Current;
};

export type Current = {
  last_updated_epoch: number;
  last_updated: string;
  temp_c: number;
  temp_f: number;
  is_day: number;
  condition: Condition;
  wind_mph: number;
  wind_kph: number;
  wind_degree: number;
  wind_dir: string;
  pressure_mb: number;
  pressure_in: number;
  precip_mm: number;
  precip_in: number;
  humidity: number;
  cloud: number;
  feelslike_c: number;
  feelslike_f: number;
  windchill_c: number;
  windchill_f: number;
  heatindex_c: number;
  heatindex_f: number;
  dewpoint_c: number;
  dewpoint_f: number;
  vis_km: number;
  vis_miles: number;
  uv: number;
  gust_mph: number;
  gust_kph: number;
};

export type Condition = {
  text: string;
  icon: string;
  code: number;
};

export type Location = {
  name: string;
  region: string;
  country: string;
  lat: number;
  lon: number;
  tz_id: string;
  localtime_epoch: number;
  localtime: string;
};

export type NewTodoRequest = z.infer<typeof NewTaskSchema>;
export type CredentialSignUpRequest = z.infer<typeof CredentialSignUpSchema>;
export type CredentialSignInRequest = z.infer<typeof CredentialSignInSchema>;
export type Task = z.infer<typeof TaskSchema>;
export type Preferences = z.infer<typeof PreferencesSchema>;

export type Principal = {
  names: string;
  email: string;
  avatar?: string;
  id: string;
};
