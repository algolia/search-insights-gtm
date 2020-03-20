const fs = require('fs');
const path = require('path');
const { exec } = require('shelljs');
const YAML = require('yaml');

function getLatestCommit() {
  const title = exec(`git log -1 --pretty=%s`)
    .toString()
    .trim();
  const hash = exec(`git log -1 --pretty=%H`)
    .toString()
    .trim();
  return { title, hash };
}

function updateMetadata({ title, hash }) {
  const filePath = path.resolve('metadata.yaml');
  const yaml = YAML.parse(fs.readFileSync(filePath).toString());
  yaml.versions = [
    {
      sha: hash,
      changeNotes: title,
    },
    ...yaml.versions,
  ];
  fs.writeFileSync(filePath, YAML.stringify(yaml));
}

function commitMetadata() {
  exec(`git add metadata.yaml`);
  exec(`git commit -m "chore: update metadata.yml"`);
}

function main() {
  const { title, hash } = getLatestCommit();
  updateMetadata(title, hash);
  commitMetadata();
}

main();
