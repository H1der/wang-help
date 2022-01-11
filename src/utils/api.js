const HOST_URI = 'http://192.168.1.130:9213/'

const EXPRESS = 'express/search/'
const GARBAGE = 'garbage/search/'

function getExpress() {
  return HOST_URI + EXPRESS
}

function getGarbage() {
  return HOST_URI + GARBAGE
}

export default {
  getExpress, getGarbage
}
