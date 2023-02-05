// read in index.html
import fs from "fs";

const html = fs.readFileSync("index.html", "utf8");

// find every script tag
const scripts = html.match(/<script.*?src="(.*?)".*?<\/script>/g);

// find the src attribute
const srcs = scripts.map((script) => script.match(/src="(.*?)"/)[1]);

// filter to only remote dependencies
const remoteDeps = srcs.filter((src) => src.startsWith("http"));

// log out the remote dependencies
console.log(remoteDeps);

// use curl to download all of the remote dependencies
remoteDeps.forEach((dep) => {
  const cmd = `curl ${dep} -o ${dep.split("/").pop()}`;
  exec(cmd);
});

// in the html, replace the remote dependencies with the local ones
const newHtml = html.replace(
  /<script.*?src="(.*?)".*?<\/script>/g,
  (match, src) => {
    if (src.startsWith("http")) {
      return `<script src="${src.split("/").pop()}"></script>`;
    }
    return match;
  }
);

// write the new html to index.html
fs.writeFileSync("index.html", newHtml);
