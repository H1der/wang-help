const HOST_URI = 'https://wang-help.2hider.com/'

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
