import { Injectable } from '@angular/core';
import { BackendService } from '../backend/backend.service';

@Injectable({
  providedIn: 'root'
})
export class StatisticService {

  private route = 'stat';
  private statistics = [];

  constructor(private backend: BackendService) {
    this.backend.get(this.route).subscribe((stats) => {
      this.statistics = stats;
      console.log(stats);
    })
  }

  getStatistics() {
    return this.statistics;
  }

  postStatistic(stat) {
    this.backend.post(this.route, stat).subscribe(stat => {
      console.log(`${stat} is post on the server`);
    })
  }
}
