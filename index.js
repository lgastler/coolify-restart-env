// every time the file is run add the current timestamp to a array in a json file inside /data/data.json

const fs = require("fs/promises");
const path = require("path");

const formatter = Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "long",
  day: "numeric",
  hour: "numeric",
  minute: "numeric",
  second: "numeric",
});

const dataPath = path.join(__dirname, "data", "data.json");

async function fsExists(path) {
  return await fs
    .access(path)
    .then(() => true)
    .catch(() => false);
}

(async () => {
  //check if the directory exists
  const dirExists = await fsExists(path.dirname(dataPath));

  if (!dirExists) {
    await fs.mkdir(path.dirname(dataPath));
  }

  //check if the file exists
  const fileExists = await fsExists(dataPath);

  if (!fileExists) {
    const initialDataToSave = JSON.stringify({ timestamps: [] });
    await fs.writeFile(dataPath, initialDataToSave, "utf8");
  }

  const data = await fs.readFile(dataPath, "utf8");
  const dataObj = JSON.parse(data);

  dataObj.timestamps.push(formatter.format(new Date()));
  console.dir({ timestamps: dataObj.timestamps });

  // save the file
  const dataToSave = JSON.stringify(dataObj, null, 2);
  await fs.writeFile(dataPath, dataToSave, "utf8");

  // do not exit the process
  process.stdin.resume();
})();
