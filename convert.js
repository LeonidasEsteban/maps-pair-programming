const csv = require('csvtojson');
const fs = require('fs');

const FILE = "./euforestspecies.csv";
const CATALOGS = "./catalogs/"


async function init() {
  let rows = await csv().fromFile(FILE);
  build({
    rows,
    key: "COUNTRY",
    fileName: "countries",
  });
  build({
    rows,
    key: "SPECIES NAME",
    fileName: "species",
  });
}

// function buildSpecies(rows) {
//   let species_full = rows.map((item) => item["SPECIES NAME"]);
//   let species = [...new Set(countries_full)];
//   fs.writeFileSync(`${CATALOGS}species.json`, JSON.stringify(countries));
// }

// function buildCountries(rows) {
//   let countries_full = rows.map((item) => item["COUNTRY"]);
//   let countries = [...new Set(countries_full)];
//   fs.writeFileSync(`${CATALOGS}countries.json`, JSON.stringify(countries));
// }

function build({
  rows, key, fileName,
}) {
  let full_collection = rows.map((item) => item[key]);
  let collection = [...new Set(full_collection)];
  fs.writeFileSync(`${CATALOGS}${fileName}.json`, JSON.stringify(collection));
}

init();