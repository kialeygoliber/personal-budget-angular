import { Component, OnInit,Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ArticleComponent } from '../article/article.component';
//import { Chart } from 'chart.js';
import { HttpClient} from '@angular/common/http';

import { Chart, PieController, ArcElement, Tooltip, Legend } from 'chart.js';

Chart.register(PieController, ArcElement, Tooltip, Legend);

@Component({
  selector: 'pb-homepage',
  standalone: true,
  imports: [ArticleComponent],
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.scss'
})
export class HomepageComponent implements OnInit{

  public dataSource : {datasets: { data: number[]; backgroundColor: string[] }[]; labels: string[] }= {
    datasets: [
        {
            data: [],
            backgroundColor: [
                '#ffcd56',
                '#ff6384',
                '#36a2eb',
                '#fd6b19',
            ]
        }
    ],
    labels: []
  };

  constructor(private http: HttpClient, @Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit(): void {

    this.http.get('http://localhost:3000/budget')

    .subscribe((res: any) => {

      console.log("Budget API response:", res);

      for (var i = 0; i < res.myBudget.length; i++) {
        this.dataSource.datasets[0].data[i] = res.myBudget[i].budget;
        this.dataSource.labels[i] = res.myBudget[i].title;
        console.log(`Label: ${res.myBudget[i].title}, Budget: ${res.myBudget[i].budget}`);
    }

    if (isPlatformBrowser(this.platformId)) {
        this.createChart();
    }

    },
    (err) => {
      console.error("Budget API error:", err);
    }
  );
  }

  createChart() {
    const canvas = document.getElementById('myChart') as HTMLCanvasElement | null;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    new Chart(ctx, {
      type: 'pie',
      data: this.dataSource
    });
  }

}
