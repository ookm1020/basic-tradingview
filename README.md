## 트레이딩 뷰 차트 - Technical Analysis Charts for Reactjs (1 / 2)

---

### TradingView Chart를 create-react-app에 적용시키기 위한 예제입니다.



#### 준비사항

1. 트레이딩 뷰 차트 라이브러리
2. create-react-app



#### 트레이딩 뷰 차트 라이브러리 신청하기

[TradingView Technical Analysis Chart 신청](https://kr.tradingview.com/HTML5-stock-forex-bitcoin-charting-library/)에서 라이브러리 신청서를 작성합니다.



![](C:\Users\ookm1\Desktop\TradingView\트레이딩 뷰 신청서 양식.PNG)



1. 라이센스 계약서를 출력하여 마지막 장의 정보를 기입한 뒤 스캔하여 첨부합니다. (※ 정보 기입 시, WEB이란 항목에는 트레이딩 뷰 차트를 사용하려고 하는 도메인을 입력해야 합니다.)
2. 위 신청서 폼에 있는 "귀하의 웹사이트 URL. 무료 라이브러리는 오로지 퍼블릭 용도만 허용됨" 칸에는 신청서에 작성한 도메인과 일치해야 합니다.
3. "귀하의 개인 (회사말고) GitHub 프로화일 링크목록"이란 칸에 자신의 GitHub 주소를 넣는 이유는 트레이딩 뷰의 저장소를 접근 가능하게 해주기 때문입니다.
4. 신청 후, 약 1~2일 안에 기입한 메일로 답장이 옵니다. 절차는 까다롭지 않으며 신경써야 할 부분은 트레이딩 뷰를 사용하려고 하는 웹 어플리케이션의 URL이 퍼블릭 한 용도여야만 한다는 점입니다. (※ 트레이딩 뷰는 개인적인 사용, 취미, 연구 또는 테스트용으로는 라이브러리를 제공하지 않습니다. 다만, 개인 용도로 라이브러리가 필요하다면 유료 라이센스가 필요하며 비용은 연간 2년마다 15,000 달러가 청구된다고 합니다. )



#### 프로젝트 구조

create-react-app의 구조에 charting_library폴더를 넣습니다.

![](C:\Users\ookm1\Desktop\ca1.PNG)

TradingView에서 제공해주는 라이브러리를 다운로드 받으면 다음과 같은 폴더의 구조는 위와 같습니다. (charting_library)



#### 차트 적용하기

1. public/index.html에 다음과 같이 라이브러리를 임포트합니다.

```javascript
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>create-react-app</title>
    <script src="./charting_library/charting_library.min.js"></script>
  </head>

  <body>
    <div id="root"></div>
  </body>
</html>
```



2. src/App.js

```javascript
import React from "react";

// TradingView 컴포넌트 임포트
import { TVChartContainer } from "./components/TVChartContainer/index";

import "./App.css";
import "./error.css";

function App() {
  return (
    <div className="App">
      <TVChartContainer />
    </div>
  );
}

export default App;

```



3. src/components/TVChartContainer

TVChartContainer 폴더 구조

![](C:\Users\ookm1\Desktop\컴포넌트 구조.PNG)



4. src/components/TVChartContainer/index.jsx

```javascript
import * as React from 'react';
import './index.css';
import Datafeed from './api/'


function getLanguageFromURL() {
	const regex = new RegExp('[\\?&]lang=([^&#]*)');
	const results = regex.exec(window.location.search);
	return results === null ? null : decodeURIComponent(results[1].replace(/\+/g, ' '));
}

export class TVChartContainer extends React.PureComponent {

	static defaultProps = {
		symbol: 'Coinbase:BTC/USD',
		interval: '15',
		containerId: 'tv_chart_container',
		libraryPath: '/charting_library/',
		chartsStorageUrl: 'https://saveload.tradingview.com',
		chartsStorageApiVersion: '1.1',
		clientId: 'tradingview.com',
		userId: 'public_user_id',
		fullscreen: false,
		autosize: true,
		studiesOverrides: {},
	};

	componentDidMount() {
		const widgetOptions = {
			debug: false,
			symbol: this.props.symbol,
			datafeed: Datafeed,
			interval: this.props.interval,
			container_id: this.props.containerId,
			library_path: this.props.libraryPath,
			locale: getLanguageFromURL() || 'en',
			disabled_features: ['use_localstorage_for_settings'],
			enabled_features: ['study_templates'],
			charts_storage_url: this.props.chartsStorageUrl,
			charts_storage_api_version: this.props.chartsStorageApiVersion,
			client_id: this.props.clientId,
			user_id: this.props.userId,
			fullscreen: this.props.fullscreen,
			autosize: this.props.autosize,
			studies_overrides: this.props.studiesOverrides,
			overrides: {
				"mainSeriesProperties.showCountdown": true,
				"paneProperties.background": "#131722",
				"paneProperties.vertGridProperties.color": "#363c4e",
				"paneProperties.horzGridProperties.color": "#363c4e",
				"symbolWatermarkProperties.transparency": 90,
				"scalesProperties.textColor" : "#AAA",
				"mainSeriesProperties.candleStyle.wickUpColor": '#336854',
				"mainSeriesProperties.candleStyle.wickDownColor": '#7f323f',
			}
		};

		Datafeed.onReady(() => {
			const widget = (window.tvWidget = new window.TradingView.widget(widgetOptions));

			widget.onChartReady(() => {
				console.log('Chart has loaded!')
			});
		});
	}

	render() {
		return (
			<div
				id={ this.props.containerId }
				className={ 'TVChartContainer' }
			/>
		);
	}
}
```



5. src/components/TVChartContainer/api/historyProvider.js

※ request-promise 모듈을 설치합니다.

```nginx
npm install request-promise --save
```

```javascript
var rp = require('request-promise').defaults({json: true})

const api_root = 'https://min-api.cryptocompare.com'
const history = {}

export default {
	history: history,

    getBars: function(symbolInfo, resolution, from, to, first, limit) {
		var split_symbol = symbolInfo.name.split(/[:/]/)
			const url = resolution === 'D' ? '/data/histoday' : resolution >= 60 ? '/data/histohour' : '/data/histominute'
			const qs = {
					e: split_symbol[0],
					fsym: split_symbol[1],
					tsym: split_symbol[2],
					toTs:  to ? to : '',
					limit: limit ? limit : 2000, 
					// aggregate: 1//resolution 
				}
			// console.log({qs})

        return rp({
                url: `${api_root}${url}`,
                qs,
            })
            .then(data => {
                console.log({data})
				if (data.Response && data.Response === 'Error') {
					console.log('CryptoCompare API error:',data.Message)
					return []
				}
				if (data.Data.length) {
					console.log(`Actually returned: ${new Date(data.TimeFrom * 1000).toISOString()} - ${new Date(data.TimeTo * 1000).toISOString()}`)
					var bars = data.Data.map(el => {
						return {
							time: el.time * 1000, //TradingView requires bar time in ms
							low: el.low,
							high: el.high,
							open: el.open,
							close: el.close,
							volume: el.volumefrom 
						}
					})
						if (first) {
							var lastBar = bars[bars.length - 1]
							history[symbolInfo.name] = {lastBar: lastBar}
						}
					return bars
				} else {
					return []
				}
			})
}
}
```



6. src/components/TVChartContainer/api/stream.js

   ※ socket.io-client 모듈을 설치합니다.

```nginx
npm install socket.io-client --save
```

```javascript
// api/stream.js
import historyProvider from './historyProvider.js'
// we use Socket.io client to connect to cryptocompare's socket.io stream
var io = require('socket.io-client')
var socket_url = 'wss://streamer.cryptocompare.com'
var socket = io(socket_url)
// keep track of subscriptions
var _subs = []

export default {
 subscribeBars: function(symbolInfo, resolution, updateCb, uid, resetCache) {
  const channelString = createChannelString(symbolInfo)
  socket.emit('SubAdd', {subs: [channelString]})
  
  var newSub = {
   channelString,
   uid,
   resolution,
   symbolInfo,
   lastBar: historyProvider.history[symbolInfo.name].lastBar,
   listener: updateCb,
  }
_subs.push(newSub)
 },
 unsubscribeBars: function(uid) {
  var subIndex = _subs.findIndex(e => e.uid === uid)
  if (subIndex === -1) {
   //console.log("No subscription found for ",uid)
   return
  }
  var sub = _subs[subIndex]
  socket.emit('SubRemove', {subs: [sub.channelString]})
  _subs.splice(subIndex, 1)
 }
}

socket.on('connect', () => {
 console.log('===Socket connected')
})
socket.on('disconnect', (e) => {
 console.log('===Socket disconnected:', e)
})
socket.on('error', err => {
 console.log('====socket error', err)
})
socket.on('m', (e) => {
 // here we get all events the CryptoCompare connection has subscribed to
 // we need to send this new data to our subscribed charts
 const _data= e.split('~')
 if (_data[0] === "3") {
  // console.log('Websocket Snapshot load event complete')
  return
 }
 const data = {
  sub_type: parseInt(_data[0],10),
  exchange: _data[1],
  to_sym: _data[2],
  from_sym: _data[3],
  trade_id: _data[5],
  ts: parseInt(_data[6],10),
  volume: parseFloat(_data[7]),
  price: parseFloat(_data[8])
 }
 
 const channelString = `${data.sub_type}~${data.exchange}~${data.to_sym}~${data.from_sym}`
 
 const sub = _subs.find(e => e.channelString === channelString)
 
 if (sub) {
  // disregard the initial catchup snapshot of trades for already closed candles
  if (data.ts < sub.lastBar.time / 1000) {
    return
   }
  
var _lastBar = updateBar(data, sub)

// send the most recent bar back to TV's realtimeUpdate callback
  sub.listener(_lastBar)
  // update our own record of lastBar
  sub.lastBar = _lastBar
 }
})

// Take a single trade, and subscription record, return updated bar
function updateBar(data, sub) {
 var lastBar = sub.lastBar
 let resolution = sub.resolution
 if (resolution.includes('D')) {
  // 1 day in minutes === 1440
  resolution = 1440
 } else if (resolution.includes('W')) {
  // 1 week in minutes === 10080
  resolution = 10080
 }
var coeff = resolution * 60
 // console.log({coeff})
 var rounded = Math.floor(data.ts / coeff) * coeff
 var lastBarSec = lastBar.time / 1000
 var _lastBar
 
if (rounded > lastBarSec) {
  // create a new candle, use last close as open **PERSONAL CHOICE**
  _lastBar = {
   time: rounded * 1000,
   open: lastBar.close,
   high: lastBar.close,
   low: lastBar.close,
   close: data.price,
   volume: data.volume
  }
  
 } else {
  // update lastBar candle!
  if (data.price < lastBar.low) {
   lastBar.low = data.price
  } else if (data.price > lastBar.high) {
   lastBar.high = data.price
  }
  
  lastBar.volume += data.volume
  lastBar.close = data.price
  _lastBar = lastBar
 }
 return _lastBar
}

// takes symbolInfo object as input and creates the subscription string to send to CryptoCompare
function createChannelString(symbolInfo) {
  var channel = symbolInfo.name.split(/[:/]/)
  const exchange = channel[0] === 'GDAX' ? 'Coinbase' : channel[0]
  const to = channel[2]
  const from = channel[1]
 // subscribe to the CryptoCompare trade channel for the pair and exchange
  return `0~${exchange}~${from}~${to}`
}
```



7. src/components/TVChartContainer/api/index.js

```javascript
import historyProvider from './historyProvider'
import stream from './stream'

const supportedResolutions = ["1", "3", "5", "15", "30", "60", "120", "240", "D"]

const config = {
    supported_resolutions: supportedResolutions
}; 

export default {
	onReady: cb => {
	console.log('=====onReady running')	
		setTimeout(() => cb(config), 0)
		
	},
	searchSymbols: (userInput, exchange, symbolType, onResultReadyCallback) => {
		console.log('====Search Symbols running')
	},
	resolveSymbol: (symbolName, onSymbolResolvedCallback, onResolveErrorCallback) => {
		// expects a symbolInfo object in response
		console.log('======resolveSymbol running')
		// console.log('resolveSymbol:',{symbolName})
		var split_data = symbolName.split(/[:/]/)
		// console.log({split_data})
		var symbol_stub = {
			name: symbolName,
			description: '',
			type: 'crypto',
			session: '24x7',
			timezone: 'Etc/UTC',
			ticker: symbolName,
			exchange: split_data[0],
			minmov: 1,
			pricescale: 100000000,
			has_intraday: true,
			intraday_multipliers: ['1', '60'],
			supported_resolution:  supportedResolutions,
			volume_precision: 8,
			data_status: 'streaming',
		}

		if (split_data[2].match(/USD|EUR|JPY|AUD|GBP|KRW|CNY/)) {
			symbol_stub.pricescale = 100
		}
		setTimeout(function() {
			onSymbolResolvedCallback(symbol_stub)
			console.log('Resolving that symbol....', symbol_stub)
		}, 0)
		
		
		// onResolveErrorCallback('Not feeling it today')

	},
	getBars: function(symbolInfo, resolution, from, to, onHistoryCallback, onErrorCallback, firstDataRequest) {
		console.log('=====getBars running')
		// console.log('function args',arguments)
		// console.log(`Requesting bars between ${new Date(from * 1000).toISOString()} and ${new Date(to * 1000).toISOString()}`)
		historyProvider.getBars(symbolInfo, resolution, from, to, firstDataRequest)
		.then(bars => {
			if (bars.length) {
				onHistoryCallback(bars, {noData: false})
			} else {
				onHistoryCallback(bars, {noData: true})
			}
		}).catch(err => {
			console.log({err})
			onErrorCallback(err)
		})

	},
	subscribeBars: (symbolInfo, resolution, onRealtimeCallback, subscribeUID, onResetCacheNeededCallback) => {
		console.log('=====subscribeBars runnning')
		stream.subscribeBars(symbolInfo, resolution, onRealtimeCallback, subscribeUID, onResetCacheNeededCallback)
	},
	unsubscribeBars: subscriberUID => {
		console.log('=====unsubscribeBars running')

		stream.unsubscribeBars(subscriberUID)
	},
	calculateHistoryDepth: (resolution, resolutionBack, intervalBack) => {
		//optional
		console.log('=====calculateHistoryDepth running')
		// while optional, this makes sure we request 24 hours of minute data at a time
		// CryptoCompare's minute data endpoint will throw an error if we request data beyond 7 days in the past, and return no data
		return resolution < 60 ? {resolutionBack: 'D', intervalBack: '1'} : undefined
	},
	getMarks: (symbolInfo, startDate, endDate, onDataCallback, resolution) => {
		//optional
		console.log('=====getMarks running')
	},
	getTimeScaleMarks: (symbolInfo, startDate, endDate, onDataCallback, resolution) => {
		//optional
		console.log('=====getTimeScaleMarks running')
	},
	getServerTime: cb => {
		console.log('=====getServerTime running')
	}
}
```



#### 실행하기

```javascript
npm start
```

- 데이터는 src/components/TVChartContainer/api/historyProvider.js의 

  ```javascript
  const api_root = 'https://min-api.cryptocompare.com'
  ```

  에서 과거 데이터를 불러오는 구조입니다.

  

- 최신 데이터는 src/components/TVChartContainer/api/stream.js

  ```javascript
  var socket_url = 'wss://streamer.cryptocompare.com'
  ```

  에서 소켓으로 받아 적용하는 구조입니다.

[예제 결과]

![](C:\Users\ookm1\Desktop\123.PNG)





### ※ 1 편은 트레이딩 뷰 차트 라이브러리 신청과 라이브러리를 이용한 샘플 예제를 실행시키는 것에 초점을 맞췄습니다. 이 예제를 통해 응용이 원활하신 분들은 과거 데이터 및 소켓 데이터를 커스텀하여 사용이 가능할 것으로 생각됩니다.

### ※ 2 편에서는 심볼변경과 과거 데이터 및 소켓데이터 연동을 올리도록 하겠습니다.

감사합니다.

이 글을 작성하기 위해 [Jon Church님의 글](https://medium.com/@jonchurch/tradingview-charting-library-js-api-setup-for-crypto-part-1-57e37f5b3d5a) 을 참고하였습니다.