const fs = require('fs-extra');
const path = require('path');
const { main: mainPath } = require('../package.json');

const ROOT_DIR = path.resolve('src');
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
    path.join(ROOT_DIR, 'template.js')
  );
  const testContent = await fs.readFile(path.join(ROOT_DIR, 'tests.yaml'));

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
    sandboxedJsContent,
    '___TESTS___',
    testContent,
  ].join('\n\n');

  await fs.writeFile(DIST_PATH, templateContent);
}

build();
