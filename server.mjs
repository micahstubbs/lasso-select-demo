import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import bodyParser from "body-parser";
import * as turf from "@turf/turf";
import geojsonArea from "geojson-area";
import fs from "fs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// read in geojson from file
const zipCodes = JSON.parse(
  fs.readFileSync(path.join(__dirname, "data/geography/zip-codes-2020.geojson"))
);

const app = express();

app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.json());
app.post("/api/v1/lasso", (req, res) => {
  const lassoCoordinates = req.body;

  // If the first and last lasso coordinates are not the same,
  // add the first coordinate to the end of the array
  // to close the lasso polygon.
  //
  // https://stackoverflow.com/questions/49521791/detect-intersection-turf-js-first-and-last-position-are-not-equivalent
  if (
    lassoCoordinates[0][0] !==
      lassoCoordinates[lassoCoordinates.length - 1][0] ||
    lassoCoordinates[0][1] !== lassoCoordinates[lassoCoordinates.length - 1][1]
  ) {
    lassoCoordinates.push(lassoCoordinates[0]);
  }

  const lassoPolygon = turf.polygon([lassoCoordinates]);
  const intersectedZipCodes = [];

  zipCodes.features.forEach((feature) => {
    const featurePolygon = turf.multiPolygon(feature.geometry.coordinates);
    const intersection = turf.intersect(lassoPolygon, featurePolygon);
    if (intersection) {
      const areaIntersection = geojsonArea.geometry(intersection);
      const areaLasso = geojsonArea.geometry(lassoPolygon);
      intersection.properties = {
        ...feature.properties,
        ...intersection.properties,
        area: areaIntersection,
        overlap: areaIntersection / areaLasso,
      };
      intersectedZipCodes.push(intersection);
    }
  });

  console.log("lasso coordinates received", lassoCoordinates.length);
  res.status(200).send({
    message: `${lassoCoordinates.length} Lasso coordinate pairs received:`,
    success: true,
    body: intersectedZipCodes,
  });
});

const PORT = 8080;

app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});
