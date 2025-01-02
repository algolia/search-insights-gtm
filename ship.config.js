const { exec } = require('shelljs');

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
  publishCommand: ({ tag }) => {
    // update metadata.yaml by executing external script instead of inline because
    // the esm module loader being used by Ship.js is incompatible with the YAML package
    exec(`node scripts/update-metadata.js ${tag}`);
    return `git commit -am "chore: update metadata.yml"`;
  },
};
