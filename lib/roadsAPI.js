const https = require('https');
const qs = require('querystring');

class RequestError extends Error {
  constructor(statusCode, statusMessage, data) {
    super(statusMessage);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, RequestError);
    this.statusCode = statusCode;
    this.statusMessage = statusMessage;
    this.data = data;
  }
}

module.exports = {
  get RequestError () { return RequestError; },
  get APICall () { return APICall; }
};

/**
 * @param {string} baseUrl
 * @param {string|number} year
 * @param {string} [county]
 * @param {string} [town]
 * @param {number} [page]
 */
async function APICall (baseUrl, year, county, town, page = 1) {
  let url = [`${baseUrl}`.replace(/\/$/, ''), `${year}`]
    .join('/');
  const query = {};
  if (county) {
    query.county = county;
  }
  if (town) {
    query.town = town;
  }
  if (page) {
    query.page = page;
  }
  url = url.concat('?', qs.stringify(query));

  /**
   * @type {HTTPResponse}
   */
  const resp = await new Promise((resolve, reject) => {
    const req = https.request(url, (res) => {
      const { statusCode, statusMessage } = res;
      res.once('error', reject);
      let str = '';
      res.on('data', (chunk) => {
        str += chunk.toString();
      });
      res.once('end', () => {
        let data = str;
        try {
          data = JSON.parse(data);
        } catch (err) {
          // ignore json parse error
        }
        resolve({ statusCode, statusMessage, data });
      });
    });
    req.once('error', reject);
    req.setHeader('Content-Type', 'application/json');
    req.end();
  });

  if (typeof resp.data !== 'object') {
    throw new RequestError(resp.statusCode, resp.statusMessage, resp.data);
  }

  return resp;
}

/**
 * @typedef HTTPResponse
 * @property {number} statusCode
 * @property {string} statusMessage
 * @property {ResponseData} data
 */

/**
 * @typedef ResponseData
 * @property {string} responseCode example: 'OD-0101-S'. useless status code...
 * @property {string} responseMessage example: '處理完成'. useless message...
 * @property {string} totalPage example: '1'. this is {string} !?
 * @property {string} totalDataSize example: '34201'. this is {string} !?
 * @property {string} page example: '1'. this is {string} !?
 * @property {string} pageDataSize example: '52'. this is {string} !?
 * @property {RoadData[]} responseData
 */

/**
 * @typedef RoadData
 * @property {string} city example: '臺北市'.
 * @property {string} site_id example: '臺北市萬華區'.
 * @property {string} road example: '三水街'
 */
