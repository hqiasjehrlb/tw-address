/* eslint no-console: 0 */

const TWAddress = require('../index');

const lister = new TWAddress(109);

const counties = TWAddress.getCountyList();

(async () => {
  try {
    console.time('QueryAllRoads');
    for (const county of counties) {
      const towns = TWAddress.getTownList(county);
      for (const town of towns) {
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
