/* eslint-disable @typescript-eslint/member-ordering */
import { Location } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Chart, registerables } from 'chart.js';
import { ChartService } from 'src/app/service/chart/chart.service';
import { OrderService } from 'src/app/service/order/order.service';
import { ProductService } from 'src/app/service/product/product.service';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.page.html',
  styleUrls: ['./reports.page.scss'],
})

export class ReportsPage implements OnInit{
  userId: number;
  userRole: string;
  agentId: number;
  agentName: string;

    // defaultMonth = new Date().toLocaleString('ro-RO', { month: 'long'});
    defaultMonth = 'Mai';
    months = ['Ianuarie', 'Februarie', 'Martie', 'Aprilie', 'Mai', 'Iunie', 'Iulie', 'August', 'Septembrie',
      'Octombrie', 'Noiembrie', 'Decembrie'];
    defaultNumberOfObjects = 1;
    numbersOfObjects = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    products: string[] = [];

    @ViewChild('barCanvasTopProductsSoldByLoggedAgent') barCanvasTopProductsSoldByLoggedAgent: any;
    barChartTopProductsSoldByLoggedAgent: Chart;
    showContentTopProductsSoldByLoggedAgent = false;
    numberOfProductsTopProductsSoldByLoggedAgent: number;
    monthTopProductsSoldByLoggedAgent: string;
    monthPeriodStartTopProductsSoldByLoggedAgent: string;
    monthPeriodEndTopProductsSoldByLoggedAgent: string;
    canShowTopProductsSoldByLoggedAgent = false;
    canShowTopProductsSoldByLoggedAgentMessage = false;
    cantShowTopProductsSoldByLoggedAgent = false;
    canShowTopProductsSoldByLoggedAgentPeriod = false;
    cantShowTopProductsSoldByLoggedAgentPeriod = false;

    @ViewChild('barCanvasSelectedProductSoldByLoggedAgent') barCanvasSelectedProductSoldByLoggedAgent: any;
    barChartSelectedProductSoldByLoggedAgent: Chart;
    showContentSelectedProductSoldByLoggedAgent = false;
    canShowSelectedProductSoldByLoggedAgent = false;
    canShowSelectedProductSoldByLoggedAgentPeriod = false;
    canShowSelectedProductSoldByLoggedAgentMessage= false;
    cantShowSelectedProductSoldByLoggedAgent = false;
    cantShowSelectedProductSoldByLoggedAgentPeriod = false;
    monthSelectedProductSoldByLoggedAgent: string;
    monthPeriodStartSelectedProductSoldByLoggedAgent: string;
    monthPeriodEndSelectedProductSoldByLoggedAgent: string;
    searchedProductsByLoggedAgent = false;
    productName: string;

    @ViewChild('barCanvasTopAgents') barCanvasTopAgents: any;
    barChartTopAgents: Chart;
    showContentTopAgents = false;
    numberOfTopAgents: number;
    monthTopAgents: string;
    // monthPeriodStartTopProductsSoldByLoggedAgent: string;
    // monthPeriodEndTopProductsSoldByLoggedAgent: string;
    canShowTopAgents = false;
    // canShowTopProductsSoldByLoggedAgentMessage = false;
    cantShowTopAgents = false;
    // canShowTopProductsSoldByLoggedAgentPeriod = false;
    // cantShowTopProductsSoldByLoggedAgentPeriod = false;

  constructor(private router: Router, private route: ActivatedRoute, private location: Location, private orderService: OrderService,
    private chartService: ChartService, private productService: ProductService){
 }

  ngOnInit(): void {
    Chart.register(...registerables);
    this.route.queryParams
    .subscribe(params => {
      this.initParams(params);
    });
    if(this.userId === undefined){
      this.router.navigate(['login']);
    }
  }

  private initParams(params): void {
    this.userId = params.userId;
    this.userRole = params.userRole;
    this.agentId = params.agentId;
    this.agentName = params.agentName;
  }

  goBack(): void {
    this.location.back();
  }

  showContentTopProductsSoldByLoggedAgentAction(): void {
    this.showContentTopProductsSoldByLoggedAgent = !this.showContentTopProductsSoldByLoggedAgent;
    this.showContentSelectedProductSoldByLoggedAgent = false;
    this.monthTopProductsSoldByLoggedAgent = this.defaultMonth;
    this.monthPeriodStartTopProductsSoldByLoggedAgent = undefined;
    this.monthPeriodEndTopProductsSoldByLoggedAgent = undefined;
    if(this.showContentTopProductsSoldByLoggedAgent){
      if(this.numberOfProductsTopProductsSoldByLoggedAgent === undefined){
        this.numberOfProductsTopProductsSoldByLoggedAgent = this.defaultNumberOfObjects;
      }
      this.drawChartTopProductsSoldByLoggedAgent(this.numberOfProductsTopProductsSoldByLoggedAgent, this.monthTopProductsSoldByLoggedAgent);
    }
  }

  selectNumberOfProductsTopProductsSoldByLoggedAgentAction($event: any): void {
    this.numberOfProductsTopProductsSoldByLoggedAgent = parseInt($event.target.value, 10);
    if(this.monthTopProductsSoldByLoggedAgent === undefined){
      this.monthTopProductsSoldByLoggedAgent = this.defaultMonth;
    }
    if(this.showContentTopProductsSoldByLoggedAgent){
      this.drawChartTopProductsSoldByLoggedAgent(this.numberOfProductsTopProductsSoldByLoggedAgent, this.monthTopProductsSoldByLoggedAgent);
    }
  }

  clearSelectionNumberOfProductsTopProductsSoldByLoggedAgent(): void {
    this.numberOfProductsTopProductsSoldByLoggedAgent = this.defaultNumberOfObjects;
  }

  selectMonthTopProductsSoldByLoggedAgent($event: any): void {
    console.log($event.target.placeholder);
    this.monthTopProductsSoldByLoggedAgent = $event.target.value;
    if(this.numberOfProductsTopProductsSoldByLoggedAgent === undefined){
      this.numberOfProductsTopProductsSoldByLoggedAgent = this.defaultNumberOfObjects;
    }
    if(this.showContentTopProductsSoldByLoggedAgent){
      if(this.showContentTopProductsSoldByLoggedAgent){
        this.drawChartTopProductsSoldByLoggedAgent(this.numberOfProductsTopProductsSoldByLoggedAgent,
            this.monthTopProductsSoldByLoggedAgent);
      }
    }
  }

  clearSelectionMonthTopProductsSoldByLoggedAgentAction(): void {
    this.monthTopProductsSoldByLoggedAgent = this.defaultMonth;
  }

  selectMonthPeriodStartTopProductsSoldByLoggedAgent($event: any): void {
    this.monthPeriodStartTopProductsSoldByLoggedAgent = $event.target.value;
    if(this.monthPeriodEndTopProductsSoldByLoggedAgent !== undefined){
        this.drawChartTopProductsSoldByLoggedAgentPeriod(this.numberOfProductsTopProductsSoldByLoggedAgent,
          this.monthPeriodStartTopProductsSoldByLoggedAgent, this.monthPeriodEndTopProductsSoldByLoggedAgent);
    }
  }

  clearSelectionMonthPeriodStartTopProductsSoldByLoggedAgentAction(): void {
    this.monthPeriodStartTopProductsSoldByLoggedAgent = this.defaultMonth;
  }

  selectMonthPeriodEndTopProductsSoldByLoggedAgent($event: any): void {
    this.monthPeriodEndTopProductsSoldByLoggedAgent = $event.target.value;
    if(this.numberOfProductsTopProductsSoldByLoggedAgent === undefined){
      this.numberOfProductsTopProductsSoldByLoggedAgent = this.defaultNumberOfObjects;
    }
    if(this.monthPeriodStartTopProductsSoldByLoggedAgent !== undefined){
        this.drawChartTopProductsSoldByLoggedAgentPeriod(this.numberOfProductsTopProductsSoldByLoggedAgent,
          this.monthPeriodStartTopProductsSoldByLoggedAgent, this.monthPeriodEndTopProductsSoldByLoggedAgent);
    }
  }

  clearSelectionMonthPeriodEndTopProductsSoldByLoggedAgentAction(): void {
    this.monthPeriodEndTopProductsSoldByLoggedAgent = this.defaultMonth;
  }

  private drawChartTopProductsSoldByLoggedAgent(numberOfProducts: number, month: string): void {
    const labels: string[] = [];
    const data: number[] = [];
    if(this.barChartTopProductsSoldByLoggedAgent){
      this.barChartTopProductsSoldByLoggedAgent.destroy();
    }
    this.orderService.getTopNProductsSoldByLoggedAgent(this.agentId, numberOfProducts, month)
      .subscribe(graphs => {
        graphs.forEach(graph => {
          labels.push(graph.productOrCategoryName);
          data.push(graph.priceOfSoldProducts);
        });
        if(labels.length > 0){
          this.canShowTopProductsSoldByLoggedAgent = true;
          this.canShowTopProductsSoldByLoggedAgentMessage = true;
          this.cantShowTopProductsSoldByLoggedAgent = false;
          this.canShowTopProductsSoldByLoggedAgentPeriod = false;
          this.cantShowTopProductsSoldByLoggedAgentPeriod = false;
          this.barChartTopProductsSoldByLoggedAgent = this.chartService.barChartGraph(
            this.barCanvasTopProductsSoldByLoggedAgent,
            ``,
            labels,
            data
          );
        }
        else{
          this.canShowTopProductsSoldByLoggedAgent = false;
          this.cantShowTopProductsSoldByLoggedAgent = true;
          this.canShowTopProductsSoldByLoggedAgentPeriod = false;
          this.cantShowTopProductsSoldByLoggedAgentPeriod = false;
        }
      });
  }

  private drawChartTopProductsSoldByLoggedAgentPeriod(numberOfProducts: number, monthPeriodStart: string, monthPeriodEnd: string): void {
    const labels: string[] = [];
    const data: number[] = [];
    if(this.barChartTopProductsSoldByLoggedAgent){
      this.barChartTopProductsSoldByLoggedAgent.destroy();
    }
    this.orderService.getTopNProductsSoldByLoggedAgentPeriod(this.agentId, numberOfProducts, monthPeriodStart, monthPeriodEnd)
      .subscribe(graphs => {
        graphs.forEach(graph => {
          labels.push(graph.productOrCategoryName);
          data.push(graph.priceOfSoldProducts);
        });
        if(labels.length > 0){
          this.canShowTopProductsSoldByLoggedAgentPeriod = true;
          this.canShowTopProductsSoldByLoggedAgent = true;
          this.canShowTopProductsSoldByLoggedAgentMessage = false;
          this.cantShowTopProductsSoldByLoggedAgent = false;
          this.cantShowTopProductsSoldByLoggedAgentPeriod = false;
          this.barChartTopProductsSoldByLoggedAgent = this.chartService.barChartGraph(
            this.barCanvasTopProductsSoldByLoggedAgent,
            ``,
            labels,
            data
          );
        }
        else{
          this.canShowTopProductsSoldByLoggedAgentPeriod = false;
          this.canShowTopProductsSoldByLoggedAgent = false;
          this.cantShowTopProductsSoldByLoggedAgent = false;
          this.cantShowTopProductsSoldByLoggedAgentPeriod = true;
        }
      });
  }

  showContentSelectedProductSoldByLoggedAgentAction(): void {
    this.showContentSelectedProductSoldByLoggedAgent = !this.showContentSelectedProductSoldByLoggedAgent;
    this.showContentTopProductsSoldByLoggedAgent = false;
    this.monthSelectedProductSoldByLoggedAgent = this.defaultMonth;
  }

  searchProductsByLoggedAgentAction($event: any): void {
    const searchValue = $event.target.value;
    if(searchValue !== '') {
      this.searchedProductsByLoggedAgent = true;
      this.getProducts(searchValue);
      return;
    }
    this.products = [];
    this.searchedProductsByLoggedAgent = false;
   }

  getProducts(searchValue: string): void {
    this.productService.getNames(searchValue)
    .subscribe(names => {
      this.products = names;
    });
  }

  getProductNameFromSearchProductsByLoggedAgent(): string {
    if(this.productName !== undefined){
      return this.productName;
    }
  }

  showGraphForProductByLoggedAgent(productName: string): void {
    this.productName = productName;
    this.searchedProductsByLoggedAgent = false;
    this.showContentSelectedProductSoldByLoggedAgent = true;
    this.drawChartSelectedProductSoldByLoggedAgent(this.productName, this.monthSelectedProductSoldByLoggedAgent);
  }

  selectMonthSelectedProductSoldByLoggedAgent($event: any): void {
    console.log($event.target.placeholder);
    this.monthSelectedProductSoldByLoggedAgent = $event.target.value;
    if(this.showContentSelectedProductSoldByLoggedAgent){
        this.drawChartSelectedProductSoldByLoggedAgent(this.productName, this.monthSelectedProductSoldByLoggedAgent);
    }
  }

  clearSelectionMonthSelectedProductSoldByLoggedAgent(): void {
    this.monthSelectedProductSoldByLoggedAgent = this.defaultMonth;
  }

  selectMonthPeriodStartSelectedProductSoldByLoggedAgent($event: any): void {
    this.monthPeriodStartSelectedProductSoldByLoggedAgent = $event.target.value;
    if(this.monthPeriodEndSelectedProductSoldByLoggedAgent !== undefined){
        this.drawChartSelectedProductSoldByLoggedAgentPeriod(this.productName,
          this.monthPeriodStartSelectedProductSoldByLoggedAgent, this.monthPeriodEndSelectedProductSoldByLoggedAgent);
    }
  }

  clearSelectionMonthPeriodStartSelectedProductSoldByLoggedAgent(): void {
    this.monthPeriodStartSelectedProductSoldByLoggedAgent= this.defaultMonth;
  }

  selectMonthPeriodEndSelectedProductSoldByLoggedAgent($event: any): void {
    this.monthPeriodEndSelectedProductSoldByLoggedAgent = $event.target.value;
    if(this.monthPeriodStartSelectedProductSoldByLoggedAgent !== undefined){
      this.drawChartSelectedProductSoldByLoggedAgentPeriod(this.productName,
        this.monthPeriodStartSelectedProductSoldByLoggedAgent, this.monthPeriodEndSelectedProductSoldByLoggedAgent);
    }
  }

  clearSelectionMonthPeriodEndTopProductsSoldByLoggedAgent(): void {
    this.monthPeriodEndSelectedProductSoldByLoggedAgent= this.defaultMonth;
  }

  private drawChartSelectedProductSoldByLoggedAgent(productName: string, month: string): void {
    const labels: string[] = [];
    const data: number[] = [];
    if(this.barChartSelectedProductSoldByLoggedAgent !== undefined){
      this.barChartSelectedProductSoldByLoggedAgent.destroy();
    }
    this.orderService.getProductSoldByAgent(this.agentId, productName, month)
      .subscribe(graph => {
          labels.push(graph.productOrCategoryName);
          data.push(graph.priceOfSoldProducts);
          if(labels.length > 0 && labels[0] !== null){
            this.canShowSelectedProductSoldByLoggedAgent = true;
            this.canShowSelectedProductSoldByLoggedAgentPeriod = false;
            this.canShowSelectedProductSoldByLoggedAgentMessage = true;
            this.cantShowSelectedProductSoldByLoggedAgent = false;
            this.barChartSelectedProductSoldByLoggedAgent = this.chartService.barChartGraph(
              this.barCanvasSelectedProductSoldByLoggedAgent,
              ``,
              labels,
              data
            );
          }
          else{
            this.canShowSelectedProductSoldByLoggedAgent = false;
            this.cantShowSelectedProductSoldByLoggedAgent = true;
          }
      });
  }

  private drawChartSelectedProductSoldByLoggedAgentPeriod(productName: string, monthPeriodStart: string, monthPeriodEnd: string): void {
    const labels: string[] = [];
    const data: number[] = [];
    if(this.barChartSelectedProductSoldByLoggedAgent !== undefined){
      this.barChartSelectedProductSoldByLoggedAgent.destroy();
    }
    this.orderService.getProductSoldByAgentPeriod(this.agentId, productName, monthPeriodStart, monthPeriodEnd)
      .subscribe(graphs => {
        graphs.forEach(graph => {
          labels.push(graph.productOrCategoryName);
          data.push(graph.priceOfSoldProducts);
        });
          console.log(labels);
          if(labels.length > 0 && labels[0] !== null){
            this.canShowSelectedProductSoldByLoggedAgent = true;
            this.canShowSelectedProductSoldByLoggedAgentPeriod = true;
            this.canShowSelectedProductSoldByLoggedAgentMessage = false;
            this.cantShowSelectedProductSoldByLoggedAgentPeriod = false;
            this.barChartSelectedProductSoldByLoggedAgent = this.chartService.barChartGraph(
              this.barCanvasSelectedProductSoldByLoggedAgent,
              ``,
              labels,
              data
            );
          }
          else{
            this.canShowSelectedProductSoldByLoggedAgent = false;
            this.cantShowSelectedProductSoldByLoggedAgentPeriod = true;
          }
      });
  }

  showContentTopAgentsAction(): void {
    this.showContentTopAgents = !this.showContentTopAgents;
    if(this.showContentTopAgents){
      this.showContentSelectedProductSoldByLoggedAgent = false;
      this.showContentTopProductsSoldByLoggedAgent = false;
      this.monthTopAgents = this.defaultMonth;
      this.numberOfTopAgents = this.defaultNumberOfObjects;
      this.drawChartTopAgents(this.numberOfTopAgents, this.monthTopAgents);
    }
  }

  selectNumberOfTopAgentsAction($event: any): void {
    this.numberOfTopAgents = $event.target.value;
    if(this.monthTopAgents === undefined){
      this.monthTopAgents = this.defaultMonth;
    }
    this.drawChartTopAgents(this.numberOfTopAgents, this.monthTopAgents);
  }

  clearSelectionNumberOfTopAgents(): void {
    this.numberOfTopAgents = this.defaultNumberOfObjects;
  }

  selectMonthTopAgents($event: any): void {
    this.monthTopAgents = $event.target.value;
    if(this.numberOfTopAgents === undefined){
      this.numberOfTopAgents = this.defaultNumberOfObjects;
    }
    this.drawChartTopAgents(this.numberOfTopAgents, this.monthTopAgents);
  }

  private drawChartTopAgents(numberOfAgents, month: string): void {
    const labels: string[] = [];
    const data: number[] = [];
    if(this.barChartTopAgents !== undefined){
      this.barChartTopAgents.destroy();
    }
    this.orderService.getGraphAgents(numberOfAgents, month)
      .subscribe(graph => {
        graph.forEach(element => {
          labels.push(element.productOrCategoryName);
          data.push(element.priceOfSoldProducts);
        });
          this.barChartTopAgents = this.chartService.barChartGraph(
            this.barCanvasTopAgents,
            `Top ${numberOfAgents} agenti in luna ${month}`,
            labels,
            data
          );
      });
  }
}
