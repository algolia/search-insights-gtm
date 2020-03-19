const fs = require('fs');
const path = require('path');
const { exec } = require('shelljs');
const YAML = require('yaml');

function commitTemplate() {
  exec(`git add template.tpl`);
  const { code } = exec(`git commit -m "chore: release new version"`);
  if (code !== 0) {
    console.error('git commit failed!');
    process.exit(code);
  }
  return exec(`git log -1 --pretty=%H`)
    .toString()
    .trim();
}

function updateMetadata(commitHash) {
  const filePath = path.resolve('metadata.yaml');
  const yaml = YAML.parse(fs.readFileSync(filePath).toString());
  yaml.versions = [
    {
      sha: commitHash,
      changeNotes: 'Update the template',
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
  const commitHash = commitTemplate();
  updateMetadata(commitHash);
  commitMetadata();
}

main();
