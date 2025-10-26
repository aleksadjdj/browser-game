import fs from "fs";

export function loadJSON(path) {
  const data = fs.readFileSync(path, "utf-8");
  return JSON.parse(data);
}

export function saveJSON(path, data) {
  fs.writeFileSync(path, JSON.stringify(data, null, 2), "utf-8");
}

