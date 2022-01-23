const HOST_URI = 'https://wang-help.2hider.com/'

const EXPRESS = 'express/search'
const GARBAGE = 'garbage/search'
const TRAVEL = 'travel/policy'
const Oil = 'oil/price'
const LPLWEEK = 'lpl/week'
const LPLROUND = 'lpl/round'

function getExpress() {
  return HOST_URI + EXPRESS
}

function getGarbage() {
  return HOST_URI + GARBAGE
}
function getTravel() {
  return HOST_URI + TRAVEL
}

function getOil() {
  return HOST_URI + Oil
}

function getLplWeek() {
  return HOST_URI + LPLWEEK;
}

function getLplRound() {
  return HOST_URI + LPLROUND;
}


export default {
  getExpress, getGarbage,getTravel,getOil,getLplWeek,getLplRound
}
