const datas = require('../resources/tw_districts.json');

module.exports = {
  get InvalidCountyError () { return InvalidCountyError; },
  get getCountyList () { return getCountyList; },
  get getTownList () { return getTownList; }
};

class InvalidCountyError extends Error {}

function getCountyList () {
  return datas.map(d => d.name);
}

/**
 * @param {string} county 
 */
function getTownList (county) {
  const towns = datas.find(d => d.name === county);
  if (!towns) {
    throw new InvalidCountyError(`invalid county: ${county}`);
  }
  return towns.districts.map(d => d.name);
}
