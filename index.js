const {
  InvalidCountyError,
  getCountyList,
  getTownList
} = require('./lib/districts');
const { APICall, RequestError } = require('./lib/roadsAPI');

const defaultAPIUrl = 'https://www.ris.gov.tw/rs-opendata/api/v1/datastore/ODRP049';

class TWAddress {
  static get RequestError () { return RequestError; }
  static get InvalidCountyError () { return InvalidCountyError; }

  static get getCountyList () { return getCountyList; }
  static get getTownList () { return getTownList; }

  static get getYear () { return getYear; }
  static get getROCYear () { return getROCYear; }

  /**
   * @param {number} [year] ROC year. example: 109. optional, default: current ROC year.
   * @param {string} [url] TW roads api url. default: https://www.ris.gov.tw/rs-opendata/api/v1/datastore/ODRP049
   */
  constructor (year, url) {
    this.url = url || defaultAPIUrl;
    this.year = year || getROCYear(getYear());
  }

  /**
   * @param {string} county 
   * @param {string} town 
   */
  async getRoadList (county, town) {
    const resp = await APICall(this.url, this.year, county, town);
    const pages = parseInt(resp.data.totalPage, 10);
    const list = resp.data.responseData.map(d => d.road);
    const pagesArr = [];
    for (let i = 2; i <= pages; i++) {
      pagesArr.push(i);
    }
    await Promise.all(pagesArr.map(p => APICall(this.url, this.year, county, town, p)))
      .then(results => {
        results.forEach(res => {
          res.data.responseData.forEach(d => {
            list.push(d.road);
          });
        });
      });
    
    return list;
  }
}

module.exports = TWAddress;


/**
 * Get current year (in time zone +8).
 * @returns 
 */
function getYear () {
  const timestamp = new Date().getTime();
  const d = new Date(timestamp + 1000 * 60 * 60 * 8); // UTC +8 hours
  return d.getUTCFullYear();
}

/**
 * Convert to ROC year.
 * @param {number} year 
 */
function getROCYear (year) {
  return year - 1911;
}