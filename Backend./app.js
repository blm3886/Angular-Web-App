const express = require('express');
const cors=require('cors');
const app = express();

var corsOptions = {
  origin: '*',
          
}

// 'https://stockdetailsproject.wl.r.appspot.com'

//app.use(express.static(process.cws()+"dist/stock-data/index.html"));

//const axios = require('axios');
var router = express.Router();


const fetch = require('node-fetch');
const https = require('https');
const url = require('url');
const async = require('express-async-await');
const { json } = require('express');
const API = "c7roegaad3iel5ubfheg";


app.use(cors(corsOptions ));
app.options('*', cors());

/*app.get('/getData',(req,res)=>{

  res.json({
    "statusCode":200,
    "statusMessage":"success"
  })
})*/

//Recommendation Chart
async function getRecommendationData(ticker){
  let data;
  try {
  let url = 'https://finnhub.io/api/v1/stock/recommendation?symbol='+ticker+'&token=c7roegaad3iel5ubfheg';
  let headers = {'Content-Type':'application/json'};
  let result = await fetch(url,{method: 'GET', headers:headers});
  let result_data = await result.json();
   
  let years = [];
  let buy = [];
  let hold = [];
  let sell = [];
  let strongBuy = [];
  let strongSell = [];
  let symbolTicker = [];
    
  for(let i =0; i<result_data.length;i++){
    years.push(result_data[i].period);
    buy.push(result_data[i].buy);
    hold.push(result_data[i].hold);
    sell.push(result_data[i].sell);
    strongBuy.push(result_data[i].strongBuy);
    strongSell.push(result_data[i].strongSell);
    symbolTicker.push(result_data[i].symbol);
  }

  data = {
    'period' : years,
    'buy': buy,
    'sell': sell,
    'strongBuy':strongBuy,
    'strongSell':strongSell,
    'hold':hold,
    'symbol':symbolTicker
  }
  } catch (error) {
    data = 0;
  }
  return data;
}

//History Chart
/*async function getHistoryCharts(ticker){
  const d1 = new Date().getTime();
  const twoyrsago = new Date();
  
  twoyrsago.setFullYear(new Date().getFullYear()-2);
  const twoYrsTimeStamp = twoyrsago.getTime();
  
  let fromDate = Math.trunc(twoYrsTimeStamp/1000);
  let toDate = Math.trunc(d1/1000);
  
  let url = 'https://finnhub.io/api/v1/stock/candle?symbol='+ticker+'&resolution=D&from='+fromDate+'&to='+toDate+'&token=c7roegaad3iel5ubfheg';
  let headers = {'Content-Type':'application/json'};
  let result = await fetch(url,{method: 'GET', headers:headers});
  let result_data = await result.json(); 
  return result_data;
}*/

//History Chart
async function getHistoryChart(ticker){
  let result_data;

  try {

    const d1 = new Date().getTime();
    const twoyrsago = new Date();
    
    twoyrsago.setFullYear(new Date().getFullYear()-2);
    const twoYrsTimeStamp = twoyrsago.getTime();
    
    let fromDate = Math.trunc(twoYrsTimeStamp/1000);
    let toDate = Math.trunc(d1/1000);
    
    let url = 'https://finnhub.io/api/v1/stock/candle?symbol='+ticker+'&resolution=D&from='+fromDate+'&to='+toDate+'&token=c7roegaad3iel5ubfheg';
    let headers = {'Content-Type':'application/json'};
    let result = await fetch(url,{method: 'GET', headers:headers});
    result_data = await result.json(); 
    
  } catch (error) {
    result_data =0;
  }
    return result_data;
  //return data;
}




//EPS data
async function getEPSChartsData(ticker){

  let data;

  try {

  let url = 'https://finnhub.io/api/v1/stock/earnings?symbol='+ticker+'&token=c7roegaad3iel5ubfheg';
  let headers = {'Content-Type':'application/json'};
  let result = await fetch(url,{method: 'GET', headers:headers});
  let result_data = await result.json();

  let actual =[];
  let estimate =[];
  let category =[];
  let surprises =[];
  //let labels = [];

  
  for(let i=0; i < result_data.length; i++){
    actual.push(result_data[i].actual);
    estimate.push(result_data[i].estimate);
    category.push(result_data[i].period);
    surprises.push(result_data[i].surprise);
    //labels.push(result_data[i].period++result_data[i].surprise);
  }

 data ={
  'actual': actual,
  'estimate':estimate,
  'category':category,
  'surprises': surprises,
  //'labels': labels
}
    
  } catch (error) {
    data = 0;
  }
 
  return data;
}

//Details Page
async function getSearchData(ticker){
  

  try {
    let merged;
    let url = 'https://finnhub.io/api/v1/stock/profile2?symbol='+ticker+'&token=c7roegaad3iel5ubfheg';
    let headers = {'Content-Type':'application/json'};
    let result = await fetch(url,{method: 'GET', headers:headers});
    let result_data = await result.json();
  
    // Details regarding Company’s Latest Price API call.
    let url2 ='https://finnhub.io/api/v1/quote?symbol='+ticker+'&token=c7roegaad3iel5ubfheg';
    let headers1 = {'Content-Type':'application/json'};
    let result1 = await fetch(url2,{method: 'GET', headers:headers1});
    let result_data1 = await result1.json();
    
    // last active time of stockMarket.
    let lastActiveDate = result_data1.t;
    
  
    let url3 = 'https://finnhub.io/api/v1/stock/peers?symbol='+ticker+'&token=c7roegaad3iel5ubfheg';
    let headers3 = {'Content-Type':'application/json'};
    let result3 = await fetch(url3,{method: 'GET', headers:headers3});
    let result_data3 = await result3.json();
    let peers = [];
    peers.push(result_data3);
  
    let currentTimeinSec = Math.floor(Date.now()/1000);
    let result4;
    let result_data4;
    // 5 mins -- 300 sec.
    let ClosedPrice ={};
    let HighPrice ={};
    let LowPrice ={};
    let OpenPrice ={};
    let status ={};
    let timestamp ={};
    let volume ={};
   
  
    if(lastActiveDate > currentTimeinSec - 300){
      let six_hour_back = currentTimeinSec - 6*60*60;
      //console.log(six_hour_back,"Time");
      let url4 = 'https://finnhub.io/api/v1/stock/candle?symbol='+ticker+'&resolution=5&from='+six_hour_back+'&to='+currentTimeinSec+'&token=c7roegaad3iel5ubfheg'
      result4 = await fetch(url4,{method:'GET',headers:headers3});
      result_data4 = await result4.json();
    }
    else{
      
      let six_hour_back = lastActiveDate - 6*60*60;
          let url4 = 'https://finnhub.io/api/v1/stock/candle?symbol='+ticker+'&resolution=5&from='+six_hour_back+'&to='+lastActiveDate+'&token=c7roegaad3iel5ubfheg'
      result4 = await fetch(url4,{method:'GET',headers:headers3});
      result_data4 = await result4.json();
    }
  
    ClosedPrice['ClosedPrice']= result_data4.c;
    HighPrice['HighPrice'] = result_data4.h;
    LowPrice['LowPrice'] = result_data4.l;
    OpenPrice['OpenPrice'] = result_data4.o;
    status['status'] = result_data4.s;
    timestamp['timestamp'] = result_data4.t;
    volume['volume'] = result_data4.v;
  
    merged = Object.assign({}, result_data, result_data1,peers,ClosedPrice,HighPrice,LowPrice,OpenPrice,status,timestamp,volume);
    return merged;
  } catch (error) {
  }
  return 0;

}


async function getInsightsData(ticker){

  try {

    let url1 = 'https://finnhub.io/api/v1/stock/social-sentiment?symbol='+ticker+'&from=2022-01-01&token=c7roegaad3iel5ubfheg';
  //console.log(url1);
  let headers1 = {'Content-Type':'application/json'};
  let result1 = await fetch(url1,{method: 'GET', headers:headers1});
  let result_data1 = await result1.json();
  let mentionVal = 0;
  let positiveMentionVal =0;
  let negativeMentionVal =0;
  let lengthT = 0;
  let lengthR = 0;

  try {
    if(result_data1.reddit.length){
      lengthR = result_data1.reddit.length;
   }
   if(result_data1.twitter.length){
    lengthT = result_data1.twitter.length;
  }
    
  } catch (error) {
    lengthR = 20;
    lengthT = 20;
  }
  

 
  for(let i =0; i < lengthR; i++){
    mentionVal = mentionVal+result_data1.reddit[i].mention;
    positiveMentionVal = positiveMentionVal+result_data1.reddit[i].positiveMention;
    negativeMentionVal = negativeMentionVal+result_data1.reddit[i].negativeMention;
  }
  
  let twittermentionVal = 0;
  let twittwepositiveMentionVal =0;
  let twitternegativeMentionVal =0;

  for(let j =0; j < lengthT; j++){
    twittermentionVal = twittermentionVal+result_data1.twitter[j].mention;
    twittwepositiveMentionVal = twittwepositiveMentionVal+result_data1.twitter[j].positiveMention;
    twitternegativeMentionVal = twitternegativeMentionVal+result_data1.twitter[j].negativeMention;
  }


let result={
  'reddit':{
    'mention':mentionVal,
    'positiveMention': positiveMentionVal,
    'negativeMention':negativeMentionVal
  },
  'twitter':{
    'mention':twittermentionVal,
    'positiveMention': twittwepositiveMentionVal,
    'negativeMention':twitternegativeMentionVal
  }

}

 // console.log(result);
  return result;

    
  } catch (error) {
    return 0;
  }
  }


async function getRestDetails(ticker){

  try {
  //news tab data.
  const d = new Date();
  let month = d.getMonth()+1;
  if(month < 10){
    month = '0'+month;
  }
  toDay = d.getDate();
  if(toDay < 10){
    toDay = '0'+toDay;
  }

  var currentDate = d.getFullYear()+'-'+month+'-'+toDay;
 
  //seven days before days.
 let last = new Date(d.getTime() - (7*24*60*60*1000));
 let monthp = last.getMonth()+1;
 if(monthp <= 10){
   monthp = '0'+monthp;
 }
 let dayp = last.getDate();
 if(dayp <10){
   dayp = '0'+dayp;
 }

 let sevenDaysBefore = last.getFullYear()+'-'+monthp+'-'+dayp;

 let url5 = 'https://finnhub.io/api/v1/company-news?symbol='+ticker+'&from='+sevenDaysBefore+'&to='+currentDate+'&token=c7roegaad3iel5ubfheg';
 let result5 = await fetch(url5,{method:'GET',headers:{'Content-Type':'application/json'}});
 let result_data5 = await result5.json();

 let NewsData = {};
 let count = 0;

 for(let i =0; i < result_data5.length; i++){
   if(result_data5[i].category.length > 0 && result_data5[i].datetime > 0 && result_data5[i].headline.length > 0 && result_data5[i].id > 0 && result_data5[i].image.length > 0 && result_data5[i].related.length > 0 && result_data5[i].source.length > 0 && result_data5[i].summary.length > 0 && result_data5[i].url.length > 0){
      NewsData[count]=result_data5[i];
 ;
      
      count++;   
   } 

   if(count == 20){
     break;
   }
 }
 
  //console.log(NewsData);
 return NewsData;
    
  } catch (error) {
    return 0;
  }
  
}


async function getSuggestions(ticker){
  
  try {
  let url = 'https://finnhub.io/api/v1/search?q='+ticker+'&token=c7roegaad3iel5ubfheg'
  let headers = {'Content-Type':'application/json'};
  let result = await fetch(url,{method: 'GET', headers:headers});
  let result_data = await result.json();
  const resultArray = result_data.result; 
  var suggestions = {};
  var key1 = "description";
  var key2 = "symbol";
  var key3 = "displaySymbol"; 
  return result_data;
  } catch (error) {
    return 0;
  }


  
  
}


//get data for WatchList
async function getWatchList(_ticker){
  try {

    //console.log(_ticker);
    let url = 'https://finnhub.io/api/v1/quote?symbol='+_ticker+'&token=c7roegaad3iel5ubfheg';
    let result = await fetch(url,{method: 'GET', headers: {'Content-Type':'application/json'}});
    let data = await result.json();
  return data;
    
  } catch (error) {
    return 0
  }
  
}

//http://localhost:4200//getData/search?TSLA
app.get("/getData/search/:ticker",async function (req,res){
    //console.log(`\n StockTickerSymbol:${req.params.ticker.toUpperCase()}`);
    let searchResult = await getSearchData(req.params.ticker.toUpperCase());
   //let searchResult = req.params.ticker.toUpperCase()
  //console.log(`${req.patams.ticker.toUpperCase()} finished at ${Date()}\n`);
  return res.send(searchResult);
  
})

//get for portfolio
async function getPortfolio(_ticker){
  let url = 'https://finnhub.io/api/v1/quote?symbol='+_ticker+'&token=c7roegaad3iel5ubfheg';
  let result = await fetch(url,{method: 'GET', headers: {'Content-Type':'application/json'}});
  let data = await result.json();
return data;
}


app.get("/getSuggestions/:ticker",async function (req,res){
  let searchResult = await getSuggestions(req.params.ticker.toUpperCase());
 //let searchResult = req.params.ticker.toUpperCase()
//console.log(`${req.patams.ticker.toUpperCase()} finished at ${Date()}\n`);
return res.send(searchResult);

})

app.get("/getNewsData/:ticker",async function (req,res){
  let searchResult = await getRestDetails(req.params.ticker.toUpperCase());
 return res.send(searchResult);

})

//EPS Call
app.get("/getEPSChartsData/:ticker",async function (req,res){
  let data =  await getEPSChartsData(req.params.ticker.toUpperCase());
  return res.send(data);
})

//HistoryChart
app.get("/getHistChartData/:ticker",async function(req,res){
  let data =  await getHistoryChart(req.params.ticker.toUpperCase());
  return res.send(data);
})

app.get("/getWatchListData/:ticker",async function (req,res){
  var tickerNames = req.params.ticker.split(",");
  let finalData = {};
  //console.log(tickerNames.length);

   for(let i = 1; i<tickerNames.length; i++){
    //console.log(tickerNames[i]);
    let name = tickerNames[i];
    let data = await getWatchList(tickerNames[i]);
    //console.log(name,data);
    finalData[tickerNames[i]] = data;
    //finalData.push({name:data});
    //finalData = Object.assign(finalData.data);
  }
return res.send(finalData);
})

app.get("/getInsightsData/:ticker",async function (req,res){
  let InsightsResult = await getInsightsData(req.params.ticker.toUpperCase());
  return res.send(InsightsResult);
})

app.get("/getRecommendationChartData/:ticker",async function (req,res){
  let RecommendationResult = await getRecommendationData(req.params.ticker.toUpperCase());
  return res.send(RecommendationResult);
})

app.get("/getPortfolioData/:ticker",async function (req,res){
  var tickerNames = req.params.ticker.split(",");
  let finalData = {};
  
  for(let i =0; i<tickerNames.length-1;i++){
     let name = tickerNames[i];
     let data = await getPortfolio(tickerNames[i])

     finalData[tickerNames[i]] = data;
  }
  return res.send(finalData);
})

//Root




app.get("/",(req,res)=>{

  res.send("Root");
})

app.get("/data/ser",(req,res)=>{
  res.send("data");
})

const PORT = parseInt(process.env.PORT) || 8080;
app.listen(PORT,(req,res)=>{
  //console.log('express API is running');
})

module.exports = router;