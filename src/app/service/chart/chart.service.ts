import { Injectable } from '@angular/core';
import { Chart }  from 'node_modules/chart.js';

@Injectable({
  providedIn: 'root'
})
export class ChartService {

  constructor() { }

  lineChartGraph(
    lineCanvas: any,
    label: string,
    labels: string[],
    data: number[]
    ): any {

    return new Chart(lineCanvas.nativeElement, {
      type: 'line',
      data: {
          // labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
          labels,
          datasets: [
              {
                  label,
                  fill: false,
                  backgroundColor: 'rgba(75,192,192,0.4)',
                  borderColor: 'rgba(75,192,192,1)',
                  borderCapStyle: 'butt',
                  borderDash: [],
                  borderDashOffset: 0.0,
                  borderJoinStyle: 'miter',
                  pointBorderColor: 'rgba(75,192,192,1)',
                  pointBackgroundColor: '#fff',
                  pointBorderWidth: 1,
                  pointHoverRadius: 5,
                  pointHoverBackgroundColor: 'rgba(75,192,192,1)',
                  pointHoverBorderColor: 'rgba(220,220,220,1)',
                  pointHoverBorderWidth: 2,
                  pointRadius: 1,
                  pointHitRadius: 10,
                  // data: [65, 59, 80, 81, 56, 55, 40],
                  data,
                  spanGaps: false,
              }
          ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false
      }
    });
  }

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
