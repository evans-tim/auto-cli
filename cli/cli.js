import yargs from "yargs";
import { hideBin } from "yargs/helpers";

import modelCommands from "./commands/index.js";

const yarg = yargs(hideBin(process.argv));
yarg.recommendCommands();
for (const model of modelCommands) {
  for (const command of model) {
    yarg.command(command);
  }
}

yarg.help().argv;
