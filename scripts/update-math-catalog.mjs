import {writeFileSync} from "node:fs";
import {metadata,categories} from "../assets/js/math-studio-models.mjs";
writeFileSync(new URL("../_data/math_studio.json",import.meta.url),JSON.stringify({categories,experiments:metadata},null,2)+"\n");
console.log("Updated "+metadata.length+" mathematics experiments.");
