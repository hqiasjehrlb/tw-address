/* eslint no-console: 0 */

const TWAddress = require('../index');

const lister = new TWAddress(109);

const counties = TWAddress.getCountyList();

const ignoreTowns = [
  '南竿鄉',
  '北竿鄉',
  '莒光鄉',
  '東引鄉',
  '釣魚臺',
  '阿里山鄉',
  '東沙群島',
  '南沙群島',
  '那瑪夏區',
  '茂林區',
  '烏坵鄉'
];

(async () => {
  try {
    console.time('QueryAllRoads');
    for (const county of counties) {
      const towns = TWAddress.getTownList(county);
      for (const town of towns) {
        if (ignoreTowns.includes(town)) {
          continue;
        }
        const roads = await lister.getRoadList(county, town);
        for (const road of roads) {
          console.log(county, town, road);
        }
      }
    }
    console.timeEnd('QueryAllRoads');
  } catch (err) {
    console.error(err);
  }
})();
