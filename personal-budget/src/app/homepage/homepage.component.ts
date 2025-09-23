import { Component, OnInit,Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ArticleComponent } from '../article/article.component';
import { BreadcrumbsComponent } from '../breadcrumbs/breadcrumbs.component';
import { HttpClientModule} from '@angular/common/http';

import { Chart, PieController, ArcElement, Tooltip, Legend } from 'chart.js';
import * as d3 from 'd3';


import { DataService, BudgetItem, IncomeItem } from '../data.service';

Chart.register(PieController, ArcElement, Tooltip, Legend);




interface SliceElement extends SVGPathElement {
  _current?: d3.PieArcDatum<{ label: string; value: number }>;
}

@Component({
  selector: 'pb-homepage',
  standalone: true,
  imports: [ArticleComponent, BreadcrumbsComponent, HttpClientModule],
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

  constructor(
    private dataService: DataService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    this.dataService.getData().subscribe(res => {
      // Chart.js pie chart
      res.myBudget.forEach((item, i) => {
        this.dataSource.datasets[0].data[i] = item.budget;
        this.dataSource.labels[i] = item.title;
      });

      if (isPlatformBrowser(this.platformId)) {
        this.createChart();

        // D3 pie chart for income
        const incomeData = (res.income || []).map(item => ({
          label: item.title,
          value: item.amount
        }));
        this.createIncomeChart(incomeData);
      }
    });
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










  createIncomeChart(data: { label: string; value: number }[]) {
    const width = 400;
    const height = 400;
    const radius = Math.min(width, height) / 2.5;

    d3.select('#incomeChart').selectAll('*').remove();

    const svg = d3.select('#incomeChart')
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${width / 2}, ${height / 2})`);

    const color = d3.scaleOrdinal<string>()
      .domain(data.map(d => d.label))
      .range(['#92DDB6', '#69B594', '#003E1F', '#C1EBD5', '#006633']);

    const pie = d3.pie<{ label: string; value: number }>()
      .sort(null)
      .value(d => d.value);

    const arc = d3.arc<d3.PieArcDatum<{ label: string; value: number }>>()
      .innerRadius(0)
      .outerRadius(radius * 0.8);

    const outerArc = d3.arc<d3.PieArcDatum<{ label: string; value: number }>>()
      .innerRadius(radius * 0.9)
      .outerRadius(radius * 0.9);

    // Draw slices
    svg.selectAll('path.slice')
      .data(pie(data))
      .enter()
      .append('path')
      .attr('class', 'slice')
      .attr('d', arc)
      .attr('fill', d => color(d.data.label) as string);

    // Add labels
    const text = svg.selectAll('text')
      .data(pie(data))
      .enter()
      .append('text')
      .text(d => d.data.label)
      .attr('transform', d => {
        const pos = outerArc.centroid(d);
        pos[0] = radius * 0.95 * (d.startAngle + (d.endAngle - d.startAngle)/2 < Math.PI ? 1 : -1);
        return `translate(${pos})`;
      })
      .style('text-anchor', d => (d.startAngle + (d.endAngle - d.startAngle)/2 < Math.PI ? 'start' : 'end'))
      .attr('dy', '0.35em')
      .attr('font-size', '12px');

    // Draw polylines
    svg.selectAll('polyline')
      .data(pie(data))
      .enter()
      .append('polyline')
      .attr('points', d => {
        const pos = outerArc.centroid(d);
        pos[0] = radius * 0.95 * (d.startAngle + (d.endAngle - d.startAngle)/2 < Math.PI ? 1 : -1);
        return [arc.centroid(d), outerArc.centroid(d), pos] as any;
      })
      .style('fill', 'none')
      .style('stroke', 'black')
      .style('stroke-width', 1);
  }


}
