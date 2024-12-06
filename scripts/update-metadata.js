const fs = require('fs');
const path = require('path');
const { exec } = require('shelljs');
const YAML = require('yaml');

function getLatestCommit() {
  const title = exec(`git log -1 --pretty=%s`).toString().trim();
  const hash = exec(`git log -1 --pretty=%H`).toString().trim();
  return { title, hash };
}

function updateMetadata({ tag, hash }) {
  const filePath = path.resolve('metadata.yaml');
  const yaml = YAML.parse(fs.readFileSync(filePath).toString());
  yaml.versions = [
    {
      sha: hash,
      changeNotes: `chore: update version to ${tag}`,
    },
    ...yaml.versions,
  ];
  fs.writeFileSync(filePath, YAML.stringify(yaml));
}

function main(tag) {
  const { hash } = getLatestCommit();
  updateMetadata({ tag, hash });
}

main(process.argv[2]);
