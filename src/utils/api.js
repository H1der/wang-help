const HOST_URI = 'https://wang-help.2hider.com/'

const EXPRESS = 'express/search/'
const GARBAGE = 'garbage/search/'
const TRAVEL = 'travel/policy/'
const Oil = 'oil/price/'

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


export default {
  getExpress, getGarbage,getTravel,getOil
}
