const scraper = require("images-scraper");
const download = require("image-downloader");
const merge = require("merge-img");
const colorthief = require("colorthief");

const species = require("./catalogs/species.json")


let LIMIT = 2;

const google = new scraper({
    puppeteer:{
        headless: true
    }
});

async function searchAnalize(specie,query){ 
    const images = await google.scrape(query, 3);
    //console.log(images);
    const downloads = await Promise.all( images.map( async image => {
        let date = new Date();
        let filename = date.getTime();
        let options = {
            url: image['url'],
            dest: `./images/${filename}.jpg`
        };
        return await download.image(options);
    }) );
    //console.log(downloads);

    let img = await merge(downloads.map( download => download.filename) )
    let path =`./collage/${specie}.png`;
    img.write(path , async () => {
        const color = await colorthief.getColor(path);
        console.log(color);
    });
}

function init(){
    console.log(`Species : ${species.length}`)
    for(let index = 0; index< LIMIT; index++){
        searchAnalize(species[index],
            `"${species[index]}" filetype:jpg -blue -white imagesize:medium`);
        //console.log(species[index]);
    }
}

init();