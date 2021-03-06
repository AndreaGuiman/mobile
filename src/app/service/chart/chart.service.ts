import { Injectable } from '@angular/core';
import { Chart }  from 'node_modules/chart.js';

@Injectable({
  providedIn: 'root'
})
export class ChartService {

  constructor() { }

  barChartGraph(barCanvas: any,
    label: string,
    labels: string[],
    data: number[]
    ): any {

    return new Chart(barCanvas.nativeElement, {
      type: 'bar',
      data: {
          labels,
          datasets: [{
              label,
              data,
              backgroundColor: [
                  'rgba(255, 99, 132, 0.2)',
                  'rgba(54, 162, 235, 0.2)',
                  'rgba(255, 206, 86, 0.2)',
                  'rgba(75, 192, 192, 0.2)',
                  'rgba(153, 102, 255, 0.2)',
                  'rgba(255, 159, 64, 0.2)'
              ],
              borderColor: [
                  'rgba(255, 99, 132, 1)',
                  'rgba(54, 162, 235, 1)',
                  'rgba(255, 206, 86, 1)',
                  'rgba(75, 192, 192, 1)',
                  'rgba(153, 102, 255, 1)',
                  'rgba(255, 159, 64, 1)'
              ],
              borderWidth: 1
          }]
      },
      options: {
          scales: {
              y: {
                  beginAtZero: true
              }
          },
          responsive: true,
          maintainAspectRatio: false
      }
    });
  }
}
