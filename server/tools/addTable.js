const { spawn } = require("child_process");

let args = process.argv.slice(2);

let table_name = args[0];
let attributes = args[1];

commands = [];
commands.push({
  command: `npx sequelize-cli model:generate --underscored --name ${table_name} --attributes ${attributes}`,
  describe: `Generating Model and Migration`,
});
commands.push({
  command: `npx sequelize-cli db:migrate`,
  describe: `Running Migration`,
});
commands.push({
  command: `node .\\tools\\routeBuilder.js --name ${table_name} --attributes ${attributes}`,
  describe: `Generating Express Routes`,
});
commands.push({
  command: `node ..\\cli\\tools\\commandBuilder.js --name ${table_name} --attributes ${attributes}`,
  describe: `Generating CLI Commands`,
});

const runCommand = (command) => {
  return new Promise((resolve, reject) => {
    const parts = command.split(" ");
    const cmd = parts[0];
    const args = parts.slice(1);

    const child = spawn(cmd, args, { shell: true });
    child.on("exit", (code) => {
      if (code === 0) {
        console.log("[addTable] Success");
        resolve();
      } else {
        reject(new Error(`[addTable] Command ${cmd} failed with code ${code}`));
      }
    });
  });
};

(async () => {
  try {
    for (let command of commands) {
      console.log(`[addTable] ${command.describe}`);
      await runCommand(command.command);
    }
    console.log("[addTable] All commands completed successfully");
  } catch (err) {
    console.error("[addTable] Error running commands: ", err);
  }
})();
