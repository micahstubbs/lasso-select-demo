// read in a shapefile and convert it to geojson
// usage: node shapefileToGeojson.mjs <shapefile> <outputfile>
// example: node shapefileToGeojson.mjs ./data/geography/cb_2020_us_zcta520_500k.shp ./data/geography/zip-codes-2020.geojson

import { readFileSync, writeFileSync } from "fs";
import path, { join } from "path";
import { fileURLToPath } from "url";
import Shapefile from "shapefile";

const __dirname = path.dirname("..", fileURLToPath(import.meta.url));

const shapefile = process.argv[2];
const outputfile = process.argv[3];

const shp = readFileSync(join(__dirname, shapefile));
const dbf = readFileSync(join(__dirname, shapefile.replace(".shp", ".dbf")));

const geojson = await Shapefile.read(shp, dbf);

writeFileSync(join(__dirname, outputfile), JSON.stringify(geojson));
