import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

function capitalize(s) {
  return s && s[0].toUpperCase() + s.slice(1);
}

//convert from sequelize types to yarg types
const typeConverter = {
  string: "string",
  integer: "number",
  boolean: "boolean",
  date: "string",
}

const attributesToBuilderCreate = (table_name, attributes, is_update) => {
  let builderObj = {};
  attributes.split(",").map((attr) => {
    const [column_name, type] = attr.split(":");
    builderObj[column_name] = {
      describe: `${capitalize(table_name)} ${column_name}`,
      demandOption: !is_update ? true : column_name === "id" ? true : false,
      type: typeConverter[type],
    };
  });
  return JSON.stringify(builderObj);
};

const attributesToPostCreate = (attributes) => {
  let postObj = `{
  `;
  attributes.split(",").map((attr) => {
    const [column_name, type] = attr.split(":");
    postObj += `            ${column_name}: argv["${column_name}"],\n`;
  });
  postObj += `}`;
  return postObj;
};

// log the arguments after the first two
console.log(process.argv.slice(2));

let args = process.argv.slice(2);

let table_name = args[1];
let table_name_singular = table_name;
let attributes = args[3];

let preamble = `import fetch from "node-fetch";
import { BASE_URL } from "../env.js";
`;
let commands_string = `
const ${table_name}Commands = [
  {
    command: "${table_name} list",
    describe: "List all ${table_name}",
    handler: async () => {
      try {
        const response = await fetch(\`\${BASE_URL}/${table_name}\`);
        const data = await response.json();
        console.log(data);
      } catch (error) {
        console.error(error);
      }
    },
  },
  {
    command: "${table_name} create",
    describe: "Create new ${table_name_singular}",
    builder: ${attributesToBuilderCreate(
      table_name_singular,
      attributes,
      false
    )},
    handler: async (argv) => {
      try {
        const response = await fetch(\`\${BASE_URL}/${table_name}\`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(${attributesToPostCreate(attributes)}),
        });
        const data = await response.json();
        console.log(data);
      } catch (error) {
        console.error(error);
      }
    },
  },
  {
    command: "${table_name} read",
    describe: "Read ${table_name_singular} by ID",
    builder: {
      id: {
        describe: "${table_name_singular} ID",
        demandOption: true,
        type: "number",
      },
    },
    handler: async (argv) => {
      try {
        const response = await fetch(\`\${BASE_URL}/${table_name}/\${argv.id}\`);
        const data = await response.json();
        console.log(data);
      } catch (error) {
        console.error(error);
      }
    },
  },
  {
    command: "${table_name} update",
    describe: "Update ${table_name_singular} by ID",
    builder: ${attributesToBuilderCreate(
      table_name_singular,
      attributes,
      true
    )},
    handler: async (argv) => {
      try {
        const response = await fetch(\`\${BASE_URL}/${table_name}/\${argv.id}\`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(${attributesToPostCreate(attributes)}),
        });
        const data = await response.json();
        console.log(data);
      } catch (error) {
        console.error(error);
      }
    },
  },
  {
    command: "${table_name} delete",
    describe: "Delete ${table_name_singular}",
    builder: {
      id: {
        describe: "${table_name} ID",
        demandOption: true,
        type: "number",
      },
    },
    handler: async (argv) => {
      try {
        const response = await fetch(\`\${BASE_URL}/${table_name}/\${argv.id}\`, {
          method: "DELETE",
        });
        const data = await response.json();
        console.log(data);
      } catch (error) {
        console.error(error);
      }
    },
  },
];

export default ${table_name}Commands;
`;

let contents = preamble + commands_string;

const filePath = path.join(__dirname, "..", "commands", `${table_name}.js`);
fs.writeFile(filePath, contents, (err) => {
  if (err) throw err;
  console.log(`File '${table_name}.js' has been saved to /commands!`);
});
