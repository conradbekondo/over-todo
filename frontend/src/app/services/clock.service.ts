import { Injectable } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ClockService {
  private readonly currentTime = new BehaviorSubject<Date>(new Date());
  constructor() {
    setInterval(() => {
      this.currentTime.next(new Date());
    }, 1000);
  }

  get currentTime$() {
    return this.currentTime.asObservable();
  }

  get timeOfDay$() {
    return this.currentTime.pipe(
      map((time) => {
        if (time.getHours() >= 19 || time.getHours() < 5) return 'night';
        else if (time.getHours() < 12) return 'morning';
        else if (time.getHours() < 16) return 'afternoon';
        else return 'evening';
      })
    )
  }
}
