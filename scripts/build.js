const fs = require('fs-extra');
const path = require('path');
const { devDependencies, main: mainPath, version } = require('../package.json');

function escapeRegex(string) {
  return string.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
}
function getTemplateStringRegex(value) {
  return new RegExp(
    '`([^\\$`]*)(\\$\\{' + escapeRegex(value) + '\\})([^`]*)`',
    'g'
  );
}
function getTemplateStringReplacement(replacement) {
  return `'$1${replacement}$3'`;
}

const ROOT_DIR = path.resolve('src');
const BUILD_DIR = path.resolve('build');
const DIST_PATH = path.resolve(mainPath);

async function build() {
  const tosContent = await fs.readFile(
    path.join(ROOT_DIR, 'terms-of-service.txt')
  );
  const infoContent = await fs.readFile(path.join(ROOT_DIR, 'info.json'));
  const templateParametersContent = await fs.readFile(
    path.join(ROOT_DIR, 'template-parameters.json')
  );
  const webPermissionsContent = await fs.readFile(
    path.join(ROOT_DIR, 'web-permissions.json')
  );
  const sandboxedJsContent = await fs.readFile(
    path.join(BUILD_DIR, 'src', 'template.js')
  );
  const testContent = await fs.readFile(path.join(ROOT_DIR, 'tests.yaml'));

  const replacedJsContent = String(sandboxedJsContent)
    .replace(
      "import { devDependencies, version } from '../package.json';\n",
      ''
    )
    .replace(
      getTemplateStringRegex("devDependencies['search-insights']"),
      getTemplateStringReplacement(devDependencies['search-insights'])
    )
    .replace(
      getTemplateStringRegex('version'),
      getTemplateStringReplacement(version)
    );

  const templateContent = [
    '___TERMS_OF_SERVICE___',
    tosContent,
    '___INFO___',
    infoContent,
    '___TEMPLATE_PARAMETERS___',
    templateParametersContent,
    '___WEB_PERMISSIONS___',
    webPermissionsContent,
    '___SANDBOXED_JS_FOR_WEB_TEMPLATE___',
    replacedJsContent,
    '___TESTS___',
    testContent,
  ].join('\n\n');

  await fs.writeFile(DIST_PATH, templateContent);
}

build();
