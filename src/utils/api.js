// const HOST_URI = 'https://wang-help.2hider.com/'
const HOST_URI = 'http://192.168.31.7:8091/'

const EXPRESS = 'express/search'
const GARBAGE = 'garbage/search'
const TRAVEL = 'travel/policy'
const Oil = 'oil/price'
const OilCHANGE = 'oil/changInfo'
const LPLWEEK = 'lpl/week'
const LPLROUND = 'lpl/round'
const BODYSEG = 'baidu_ai/body_seg'
const LOTTERY = 'lottery/lottery'
const LOTTERYHISTORY = 'lottery/history'
const ABBR = 'abbr/search'
const WEATHEROPENID = 'wechat/getOpenid'
const USERREGISTER = 'wechat/register'

export function getExpress() {
  return HOST_URI + EXPRESS
}

export function getGarbageApi() {
  return HOST_URI + GARBAGE
}

export function getTravel() {
  return HOST_URI + TRAVEL
}

export function getOilApi() {
  return HOST_URI + Oil
}

export function getOilChangeApi() {
  return HOST_URI + OilCHANGE;
}

export function getLplWeekApi() {
  return HOST_URI + LPLWEEK;
}

export function getLplRoundApi() {
  return HOST_URI + LPLROUND;
}

export function getBodySeg() {
  return HOST_URI + BODYSEG
}

export function getLottery() {
  return HOST_URI + LOTTERY;
}

export function getLotteryHistory() {
  return HOST_URI + LOTTERYHISTORY;
}

export function getAbbrApi() {
  return HOST_URI + ABBR
}
export function getWeatherOpenid() {
  return HOST_URI + WEATHEROPENID
}

export function UserRegister() {
  return HOST_URI + USERREGISTER
}

