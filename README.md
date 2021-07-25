# tw-address
Get TW road list by open data API.

# Install
```
npm i tw-address
```
# Usage
```javascript
const TWAddress = require('tw-address');

/**
 * Create new instance.
 * First argument is ROC year. Available values are 107, 108, 109, optional, default value: CURRENT_ROC_YEAR
 * Second argument is API base url, optional, default: https://www.ris.gov.tw/rs-opendata/api/v1/datastore/ODRP049
 */
const twAddress = new TWAddress(109);

/**
 * To get road list.
 * First argument is county, required.
 * Second argument is town, required.
 * @type {Promise}
 */
twAddress.getRoadList('臺北市', '中正區')
  .then(roads => {
    /**
     * Return data type is {string[]}
     */
    roads.forEach((road) => {
      console.log(road);
    });
  });

/**
 * To get roads data.
 * First argument is county, optional.
 * Second argument is town, optional.
 * Third argument is page, optional, default: 1.
 * @type {Promise}
 */
twAddress.getAPI('臺北市', '中正區', 1)
  .then(resp => {
    /**
     * Response schema:
     * https://github.com/hqiasjehrlb/tw-address/blob/aaba0978da90f43e3af1855050546325fef2a448/lib/roadsAPI.js#L76
     */
    console.log(resp);
  });

/**
 * To get county list.
 * @type {string[]}
 */
const counties = TWAddress.getCountyList();

/**
 * To get town list.
 * Argument <county> is required.
 * @type {string[]}
 */
const towns = TWAddress.getTownList(county);
```

# References
[Taiwan District Data](https://gist.githubusercontent.com/abc873693/2804e64324eaaf26515281710e1792df/raw/a1e1fc17d04b47c564bbd9dba0d59a6a325ec7c1/taiwan_districts.json)

[Taiwan Roads Opendata](https://www.ris.gov.tw/rs-opendata/api/Main/docs/v1)
