import socketClient from "socket.io-client";

// api/stream.js
import historyProvider from './historyProvider.js'
// we use Socket.io client to connect to cryptocompare's socket.io stream
// var io = require('socket.io-client')
// var socket_url = 'wss://streamer.cryptocompare.com'
// var socket = io(socket_url)
// keep track of subscriptions
var _subs = []

const socket = socketClient(`http://localhost:3000?data=KRW-BTC`);

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

// socket.on('connect', () => {
//  console.log('===Socket connected')
// })
// socket.on('disconnect', (e) => {
//  console.log('===Socket disconnected:', e)
// })
// socket.on('error', err => {
//  console.log('====socket error', err)
// })

socket.on('/ticker', (e) => {
  console.log("매치 소켓 데이터 : ", e);

  const data = {
    sub_type: parseInt(0, 10), // ???
    exchange: "BASIC-TRADINGVIEW", // 거래소이름
    to_sym: e.code.split("-")[1], // coinTicker
    from_sym: e.code.split("-")[0], // market
    // trade_id: _data[5],
    trade_id: "",
    ts: e.timestamp * 1000, // timestamp
    volume: e.trade_volume, // 거래량
    price: e.trade_price // 가격
  };

  const channelString = `${data.sub_type}~${data.exchange}~${data.to_sym}~${data.from_sym}`;

  const sub = _subs.find(e => e.channelString === channelString);

  if (sub) {
    // disregard the initial catchup snapshot of trades for already closed candles
    if (data.ts < sub.lastBar.time / 1000) {
      return;
    }

    var _lastBar = updateBar(data, sub);

    // send the most recent bar back to TV's realtimeUpdate callback
    sub.listener(_lastBar);
    // update our own record of lastBar
    sub.lastBar = _lastBar;
  }
});

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
