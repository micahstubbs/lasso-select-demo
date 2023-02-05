import fs from "fs";
import path from "path";
import exec from "child_process";

const inDir = "./data/geography/cb_2020_us_zcta520_500k/";
const inFile = "cb_2020_us_zcta520_500k.shp";
const outFile = "zip-codes-2020.geojson";
const outDir = "./data/geography/";

exec.exec(
  `node ./scripts/shapefileToGeojson.mjs ${inDir}/${inFile} ${outDir}/${outFile}`,
  (err, stdout, stderr) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log(stdout);
  }
);
