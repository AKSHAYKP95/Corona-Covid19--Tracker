import { Component, OnInit } from '@angular/core';
import { DataServiceService } from 'src/app/services/data-service.service';
import { GlobalDataSummary } from 'src/app/models/global-data'
import { GoogleChartInterface } from 'ng2-google-charts';




@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  totalConfirmed = 0;
  totalActive = 0;
  totalDeaths = 0;
  totalRecovered = 0;
  globalData : GlobalDataSummary[] ;
  loading = true;
  pieChart: GoogleChartInterface = {
    chartType: 'PieChart',

  }
  columnChart: GoogleChartInterface = {
    chartType: 'columnChart',

  }


  constructor(private dataService : DataServiceService) { }

  initChart(caseType : string){
    let datatable = [];

    datatable.push(["Country" , "Cases"])
    this.globalData.forEach(cs=> {
      let value : number;
      if(caseType == "a")
         if(cs.active>2000)      
         value = cs.active;     
      
      if(caseType == "r")
         if(cs.active>2000)
         value = cs.recovered;     

      if(caseType == "d")
         if(cs.active>2000)
         value = cs.deaths;     

      if(caseType == "c")
         if(cs.active>2000)
         value = cs.confirmed;     

         datatable.push([
          cs.country , value
         ])
    })

    // console.log(datatable);


    this.pieChart = {
      chartType: 'PieChart',
      dataTable: datatable,
      //firstRowIsData: true,
      options: {
        height : 500,
        animation:{
          duration: 1000,
          easing: 'out',
        },
        
        },
    };
    this.columnChart = {
      chartType: 'ColumnChart',
      dataTable: datatable,
      //firstRowIsData: true,
      options: {
        height : 500,
        animation:{
          duration: 1000,
          easing: 'out',
        },
        
        },
    };
  }

  ngOnInit(): void {

    this.dataService.getGlobalData()
    .subscribe(
      {
        next : (result)=>{
          console.log(result);
          this.globalData = result;

          result.forEach(cs=>{
            if(!Number.isNaN(cs.confirmed)) {
            this.totalActive += cs.active;
            this.totalConfirmed += cs.confirmed;
            this.totalRecovered += cs.recovered;
            this.totalDeaths += cs.deaths;
            }

          })

          this.initChart('c');
        },
        complete : ()=>{
          this.loading = false;
        }
      }
    )
  }
  
  updateChart(input : HTMLInputElement){
    this.initChart(input.value);

  }

}
