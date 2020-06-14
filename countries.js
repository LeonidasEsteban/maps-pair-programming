const csv = require('csvtojson');
const fs = require('fs');
const proj4 = require("proj4");

proj4.defs([
    [
      '🇪🇺',
      '+proj=laea +lat_0=52 +lon_0=10 +x_0=4321000 +y_0=3210000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs '
    ],
    [
      '🌎',
      '+proj=longlat +datum=WGS84 +no_defs '
    ]
  ]);

const catalogCountries = require('./catalogs/countries.json')
const catalogSpecies = require('./catalogs/species.json')

const FILE = "./euforestspecies.csv";
const countries = "./data/";

function transformCoordinates(x,y){
    return proj4('🇪🇺','🌎', [+x, +y]);
}

function filterByCountry(rows){
    catalogCountries.map( country => {
        let selection = rows;
        if(country != "All"){
            selection = rows.filter( row=> row["COUNTRY"] === country);
        }
        console.log(`Country ${country} Selection ${selection.length}`);
        let cleanData = selection.map(item => {
            let coords = transformCoordinates(item['X'], item['Y']);
            return {
                lat: coords[1],
                lng: coords[0],
                specie: catalogSpecies.indexOf(item['SPECIES NAME'])
            }
        });
        fs.writeFileSync(
            `${countries}${country.toLowerCase().replace(/ /g,'')}.json`,
             JSON.stringify(cleanData)
        );
        console.log(`${country} generated`);
    });
}

async function init() {
    let rows = await csv().fromFile(FILE);

    filterByCountry(rows);
}

init();