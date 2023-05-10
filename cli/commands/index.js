import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

const basename = path.basename(__filename);

const modelCommands = [];

async function loadCommands() {
  const files = fs.readdirSync(__dirname).filter((file) => {
    return (
      file.indexOf(".") !== 0 &&
      file !== basename &&
      file.slice(-3) === ".js" &&
      file.indexOf(".test.js") === -1
    );
  });

  const promises = files.map((file) => {
    const command = import(path.join("file://" + __dirname, file));
    return command;
  });

  const results = await Promise.all(promises);

  results.forEach((result) => {
    modelCommands.push(result.default);
  });
}

await loadCommands();

export default modelCommands;
