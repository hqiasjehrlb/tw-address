const https = require('https');

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
 * @param {string} county 
 * @param {string} town 
 * @param {number} [page]
 */
async function APICall (baseUrl, year, county, town, page = 1) {
  const url = [`${baseUrl}`.replace(/\/$/, ''), `${year}`]
    .join('/')
    .concat('?county=', encodeURIComponent(county), '&town=', encodeURIComponent(town), '&page=', page);
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

  if (typeof resp.data !== 'object' || !Array.isArray(resp.data.responseData)) {
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
