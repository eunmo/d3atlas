import { geoPath } from "d3-geo";
import { geoKavrayskiy7 } from "d3-geo-projection";
import topojson from "topojson-client";
import Canvas from "canvas";
import world from "./node_modules/world-atlas/countries-110m.json" assert {type: "json"};

const [width, height] = [1920, 1200];
const projection = geoKavrayskiy7()
  .scale(360)
  .rotate([-10, 0, 0])
  .translate([width / 2, height / 2])
  .center([0, 0]);


function getMapBuffer(feature) {
  const canvas = Canvas.createCanvas(width, height);
  const context = canvas.getContext("2d");
  const path = geoPath(projection, context);

  context.beginPath();
  path(feature);
  context.fillStyle = "#fff";
  context.fill();

  const buffer = canvas.toBuffer("raw");
  return buffer;
}

function bufferSum(buffer) {
  let sum = 0;
  for (let i = 0; i < width * height; i++) {
    if (buffer[i * 4] > 0) {
      sum += 1;
    }
  }
  return sum;
}

const land = topojson.feature(world, world.objects.land);
const worldBuffer = getMapBuffer(land);
const worldCount = bufferSum(worldBuffer);
console.log(worldCount);

const countries = topojson.feature(world, world.objects.countries).features;
const c = countries[3];
const cBuffer = getMapBuffer(c);
const cCount = bufferSum(cBuffer);
console.log(cCount);
