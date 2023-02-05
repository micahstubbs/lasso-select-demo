// localizeRemoteScripts but for CSS
import fs from "fs";
import { exec } from "child_process";

const html = fs.readFileSync("index.html", "utf8");

const styles = html.match(/<link.*?\/>/gs);
console.log("styles", styles);

const hrefs = styles.map((style) => style.match(/href="(.*?)"/)[1]);
console.log("hrefs", hrefs);

const remoteDeps = hrefs.filter((href) => href.startsWith("http"));
const localDeps = hrefs.filter((href) => !href.startsWith("http"));

console.log("existing local dependencies:");
console.log(localDeps);

console.log("Remote dependencies:");
console.log(remoteDeps);

const allDeps = [...localDeps];

remoteDeps.forEach((dep) => {
  const cmd = `curl ${dep} -o ${dep.split("/").pop()}`;
  exec(cmd);

  // add local version of remove dependency to allDeps
  allDeps.push(dep.split("/").pop());
});

console.log("All local dependencies, with new ones:");
console.log(localDeps);

//
// This is buggy but works for the most part
//
// replace remote dependencies with local ones
// add the old remote href as a comment
let newHtml = html;
remoteDeps.forEach((remoteDep) => {
  newHtml = newHtml.replace(
    `href="${remoteDep}"`,
    `href="${remoteDep.split("/").pop()}"`
  );

  // prepend  <!-- ${remoteDep} -->
  // to every line that starts in <link
  newHtml = newHtml.replace(
    `<link`,
    `<!-- ${remoteDep} -->

<link`
  );
});

// add all local dependencies
localDeps.forEach((dep) => {
  newHtml = newHtml.replace(
    "</head>",
    `

<link rel="stylesheet" href="${dep}" />` + "</head>"
  );
});

// write the new HTML file

fs.writeFileSync("index.html", newHtml);

console.log(`Wrote ${remoteDeps.length} remote CSS dependencies to index.html`);
