import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { GlobalDataSummary } from 'src/app/models/global-data'
import { DateWiseData } from 'src/app/models/date-wise-data'



@Injectable({
  providedIn: 'root'
})
export class DataServiceService {

  private globalDataUrl = 'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_daily_reports/';
  private dateWiseDataUrl = 'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv';
  date=new Date();

  constructor(private http : HttpClient) { }



  getDateWiseData(){
    return this.http.get(this.dateWiseDataUrl , { responseType : 'text' }).pipe(
      map(result =>{
        let rows = result.split('\n');
        // console.log(rows);
        let mainData = {};
       let header = rows[0];
       let dates = header.split(/,(?=\S)/)

       dates.splice(0 , 4);
       rows.splice(0 , 1);

       rows.forEach(row=>{
         let cols = row.split(/,(?=\S)/);
         let con = cols[1];
         cols.splice(0 , 4);
        //  console.log(con, cols);
        //now we have to map the date with the country
        mainData[con] = [];
        cols.forEach((value,index)=>{
          let dw : DateWiseData ={
            cases : +value,
            country : con,
            date : new Date(Date.parse(dates[index]))
          }
          mainData[con].push(dw)
        })

       })
       


        return mainData;
      })
    )
    
  }
   


  getGlobalData(){
    this.date.setDate(this.date.getDate()-1);
    var Fdate=this.formatDate(this.date);
    console.log(Fdate);
    return this.http.get(this.globalDataUrl+Fdate+".csv", { responseType : 'text' }).pipe(
      map(result=>{
        let data : GlobalDataSummary[] = [];
        let raw =  {};
        let rows = result.split('\n');
        rows.splice(0 , 1);
          // console.log(rows);
          rows.forEach(row=>{
            let cols = row.split('//,(?=\S)')[0].split(',');
             // data.push({
              let cs = {

              country : cols[3],
              // '+' opertor used for converting string to type=> "number"
              confirmed : +cols[7],
              deaths : +cols[8],
              recovered : +cols[9],
              active : +cols[10],
            };
            //for merging country data like all data of 'US' in one
            let temp : GlobalDataSummary = raw[cs.country];
            //if there is an object
            if(temp){
              temp.active = cs.active + temp.active;
              temp.confirmed = cs.confirmed + temp.confirmed;
              temp.deaths = cs.deaths + temp.deaths;
              temp.recovered = cs.recovered + temp.recovered;

              raw[cs.country] = temp;

            }
            //if there is no object
            else{
              raw[cs.country] = cs;

            }


          })
         // console.log(raw);

        
        //return [];
        //<GlobalDataSummary[]> used for typeCasting

        return <GlobalDataSummary[]>Object.values(raw);
      })
    )

  }
  public formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

    var formatedDate= [month,day,year].join('-');
    var millis= Date.parse(formatedDate);
    return formatedDate;
}
}
