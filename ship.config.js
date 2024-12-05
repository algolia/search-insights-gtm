const fs = require('fs');
const path = require('path');
const { exec } = require('shelljs');
const YAML = require('yaml');

function getLatestCommit() {
  const title = exec(`git log -1 --pretty=%s`).toString().trim();
  const hash = exec(`git log -1 --pretty=%H`).toString().trim();
  return { title, hash };
}

function commitMetadata() {
  exec(`git add metadata.yaml`);
  exec(`git commit -m "chore: update metadata.yml"`);
}

module.exports = {
  shouldPrepare: ({ releaseType, commitNumbersPerType }) => {
    const { fix = 0 } = commitNumbersPerType;
    if (releaseType === 'patch' && fix === 0) {
      return false;
    }
    return true;
  },
  buildCommand: () => 'yarn build',
  pullRequestTeamReviewers: ['events-platform'],
  publishCommand: ({ tag, dir }) => {
    // update metadata.yaml
    const { hash } = getLatestCommit();
    const metadataPath = path.resolve(dir, 'metadata.yaml');
    const yaml = YAML.parse(fs.readFileSync(metadataPath).toString());
    yaml.versions = [
      {
        sha: hash,
        changeNotes: `chore: update version to ${tag}`,
      },
      ...yaml.versions,
    ];
    fs.writeFileSync(metadataPath, YAML.stringify(yaml));
    commitMetadata();
  },
};
