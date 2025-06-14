import { Component, input, resource } from '@angular/core';
import { LucideAngularModule, Thermometer } from 'lucide-angular';
import { environment } from '../../../environments/environment.development';
import { TimeOfDay, WeatherInfo } from '../../../models/types';

@Component({
  selector: 'ot-greeting',
  imports: [LucideAngularModule],
  templateUrl: './greeting.component.html',
  styleUrl: './greeting.component.css',
})
export class GreetingComponent {
  ThermoMeter = Thermometer;
  readonly userName = input<string>();
  readonly timeOfDay = input.required<TimeOfDay>();
  readonly weatherInfo = resource({
    request: () => this.timeOfDay,
    loader: async ({ request }) => {
      return await fetch(
        new URL('/api/weather', environment.apiOrigin)
      ).then<WeatherInfo>((r) => r.json());
    },
  });
}
