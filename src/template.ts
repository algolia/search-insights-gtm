import type {
  InsightsClient,
  InsightsEvent,
  Init,
  InsightsEventObjectData,
} from 'search-insights';
import { devDependencies, version } from '../package.json';

const log = require('logToConsole');
const createArgumentsQueue = require('createArgumentsQueue');
const injectScript = require('injectScript');
const queryPermission = require('queryPermission');
const setInWindow = require('setInWindow');
const copyFromWindow = require('copyFromWindow');
const makeInteger: GtmMakeInteger = require('makeInteger');
const getType: GtmGetType = require('getType');
const Math: GtmMath = require('Math');
const Object: GtmObject = require('Object');

const INSIGHTS_OBJECT_NAME = 'AlgoliaAnalyticsObject';
const INSIGHTS_LIBRARY_URL = `https://cdn.jsdelivr.net/npm/search-insights@${devDependencies['search-insights']}`;

const MAX_OBJECT_IDS = 20;
const MAX_FILTERS = 10;
const COMMA_REPLACEMENT = 'PRESERVED_COMMA_HERE';

const aa: InsightsClient = createArgumentsQueue('aa', 'aa.queue');

function isInitialized() {
  return !!copyFromWindow(INSIGHTS_OBJECT_NAME);
}

function replaceEscapedCommas(str: string) {
  while (str.indexOf('\\,') !== -1) {
    str = str.replace('\\,', COMMA_REPLACEMENT);
  }
  return str;
}

function replacePlaceholderText(str: string) {
  while (str.indexOf(COMMA_REPLACEMENT) !== -1) {
    str = str.replace(COMMA_REPLACEMENT, ',');
  }
  return str;
}

function splitPreservingEscapedCommas(str: string) {
  // GTM does not support regexes in custom templates, so we need to use straight text replacements instead
  return replaceEscapedCommas(str).split(',').map(replacePlaceholderText);
}

function formatValueToList<T>(value: T | T[]): T[] {
  if (isArray(value)) {
    return value;
  } else if (isNumber(value)) {
    return [value];
  } else if (isString(value)) {
    return splitPreservingEscapedCommas(value) as T[];
  } else {
    return [];
  }
}

function isArray(value: any): value is any[] {
  return getType(value) === 'array';
}

function isNumber(value: any): value is number {
  return getType(value) === 'number';
}

function isString(value: any): value is string {
  return getType(value) === 'string';
}

function isObject(value: any): value is Record<string, any> {
  return getType(value) === 'object';
}

function isNullOrUndefined(value: any): value is null | undefined {
  const type = getType(value);
  return type === 'null' || type === 'undefined';
}

function transformObjectData(
  objectData?: Array<Record<string, string | number | undefined>>
): InsightsEventObjectData[] | undefined {
  if (isNullOrUndefined(objectData)) {
    return undefined;
  }

  if (!isArray(objectData)) {
    logger('objectData is not a list', objectData);
    return objectData;
  }

  return objectData.map((od) => {
    if (!isObject(od)) {
      logger('objectData list item is not an object', od);
      return od;
    }

    // The API expects price to be a number so delete it entirely if empty.
    if (isString(od.price) && od.price === '') {
      od.price = undefined;
    }

    // The API expects discount to be a number so delete it entirely if empty.
    if (isString(od.discount) && od.discount === '') {
      od.discount = undefined;
    }

    // The API expects quantity to be an integer.
    // If quantity is empty, then delete it entirely because the API allows
    // quantity to be omitted from the event payload.
    if (isString(od.quantity)) {
      if (od.quantity) {
        od.quantity = makeInteger(od.quantity);
      } else {
        od.quantity = undefined;
      }
    }

    return od;
  });
}

function getLibraryURL(useIIFE: boolean) {
  return (
    INSIGHTS_LIBRARY_URL +
    (useIIFE === true ? '/dist/search-insights.iife.min.js' : '')
  );
}

function logger(message: string, event?: any) {
  log('[GTM-DEBUG] Search Insights > ' + message, event || '');
}

function shallowObjectClone<T extends Record<string, any>>(obj: T): T {
  const keys = Object.keys(obj);
  const newObj: Record<string, any> = {};
  keys.forEach((key) => {
    newObj[key] = obj[key];
  });
  return newObj as T;
}

function chunkPayload<T extends Record<string, any>>(
  payload: T,
  keys: Array<keyof T>,
  limit: number
): T[] {
  // check if the values in `payload` for each of `keys` have the same length.
  const sameNumberOfValues = keys
    .map((k) => (payload[k] as any[]).length)
    .every((n) => n === (payload[keys[0]] as any[]).length);
  if (!sameNumberOfValues) {
    // chunking behavior is unsafe due to unequal length arrays to chunk.
    // bail out early.
    return [payload as T];
  }

  const numberOfChunks = Math.ceil((payload[keys[0]] as any[]).length / limit);
  const chunks = [];
  for (let i = 0; i < numberOfChunks; i++) {
    const newPayload = shallowObjectClone<typeof payload>(payload);
    keys.forEach((key) => {
      (newPayload[key] as any) = (payload[key] as any[]).slice(
        i * limit,
        (i + 1) * limit
      );
    });

    chunks.push(newPayload);
  }
  return chunks as T[];
}

switch (data.method) {
  case 'init': {
    const pointer = copyFromWindow(INSIGHTS_OBJECT_NAME);
    if (pointer && pointer !== 'aa') {
      logger(
        'window.' +
          INSIGHTS_OBJECT_NAME +
          ' is "' +
          pointer +
          '", not "aa". This might cause issues if not using GTM to send events.'
      );
    }

    if (!isInitialized()) {
      const url = getLibraryURL(data.useIIFE);

      if (queryPermission('inject_script', url)) {
        injectScript(
          url,
          () => {
            if (!copyFromWindow('aa')) {
              data.gtmOnFailure();
              logger('[ERROR] Failed to load search-insights.');
              return;
            }

            let libraryLoaded = false;
            // call any method to see if it reacts.
            // `getUserToken` is synchronous, so it updates the flag immediately.
            aa('getUserToken', null, () => {
              libraryLoaded = true;
            });
            if (libraryLoaded) {
              data.gtmOnSuccess();
            } else {
              log(
                '[ERROR] Failed to load search-insights.\n\n' +
                  'If your website is using RequireJS, you need to turn on "Use IIFE" option of Initialization method.'
              );
              data.gtmOnFailure();
            }
          },
          data.gtmOnFailure,
          url
        );
      } else {
        logger(
          'The library endpoint is not allowed in the "Injects Scripts" permissions.\n\n' +
            'You need to add the value: "' +
            'https://cdn.jsdelivr.net/npm/search-insights*' +
            '"\n\n' +
            'See https://www.simoahava.com/analytics/custom-templates-guide-for-google-tag-manager/#step-4-modify-permissions'
        );
        data.gtmOnFailure();
        break;
      }
    } else {
      logger('[INFO] search-insights is already loaded.');
    }

    log(
      '[INFO] Algolia GTM template no longer validates event payloads.\nYou can visit https://algolia.com/events/debugger instead.'
    );

    const initOptions: Parameters<Init>[1] = {
      appId: data.appId,
      apiKey: data.apiKey,
      authenticatedUserToken: data.init_authenticatedUserToken,
      userHasOptedOut: data.userHasOptedOut,
      region: data.region,
      cookieDuration: makeInteger(data.cookieDuration),
      useCookie: data.useCookie !== false, // true by default
      host: data.host,
    };

    logger(data.method, initOptions);
    aa(data.method, initOptions);

    const userAgent = `insights-gtm (${version})`;
    logger('addAlgoliaAgent', userAgent);
    aa('addAlgoliaAgent', userAgent);

    if (data.initialUserToken) {
      logger('setUserToken', data.initialUserToken);
      aa('setUserToken', data.initialUserToken);
    }

    setInWindow(INSIGHTS_OBJECT_NAME, 'aa');

    break;
  }

  case 'setAuthenticatedUserToken': {
    if (!isInitialized()) {
      logger('You need to call the "init" method first.');
      data.gtmOnFailure();
      break;
    }

    const token = data.setAuthenticatedUserToken_token || undefined;

    logger('setAuthenticatedUserToken', token);
    aa('setAuthenticatedUserToken', token);
    break;
  }

  case 'viewedObjectIDs': {
    if (!isInitialized()) {
      logger('You need to call the "init" event first.');
      data.gtmOnFailure();
      break;
    }

    const payload: InsightsEvent = {
      eventType: 'view',
      eventName: data.eventName,
      index: data.index,
      objectIDs: formatValueToList(data.objectIDs),
      objectData: transformObjectData(data.objectData),
      userToken: data.userToken,
      authenticatedUserToken: data.authenticatedUserToken,
    };
    const chunks = chunkPayload(
      payload,
      ['objectIDs', 'objectData'],
      MAX_OBJECT_IDS
    );

    logger('sendEvents', chunks);
    aa('sendEvents', chunks);
    data.gtmOnSuccess();
    break;
  }

  case 'clickedObjectIDsAfterSearch': {
    if (!isInitialized()) {
      logger('You need to call the "init" event first.');
      data.gtmOnFailure();
      break;
    }

    const payload: InsightsEvent = {
      eventType: 'click',
      eventName: data.eventName,
      index: data.index,
      objectIDs: formatValueToList(data.objectIDs),
      objectData: transformObjectData(data.objectData),
      positions: formatValueToList(data.positions).map(makeInteger),
      queryID: data.queryID,
      userToken: data.userToken,
      authenticatedUserToken: data.authenticatedUserToken,
    };
    const chunks = chunkPayload(
      payload,
      ['objectIDs', 'objectData', 'positions'],
      MAX_OBJECT_IDS
    );

    logger('sendEvents', chunks);
    aa('sendEvents', chunks);
    data.gtmOnSuccess();
    break;
  }

  case 'clickedObjectIDs': {
    if (!isInitialized()) {
      logger('You need to call the "init" event first.');
      data.gtmOnFailure();
      break;
    }

    const payload: InsightsEvent = {
      eventType: 'click',
      eventName: data.eventName,
      index: data.index,
      queryID: data.queryID,
      objectIDs: formatValueToList(data.objectIDs),
      objectData: transformObjectData(data.objectData),
      userToken: data.userToken,
      authenticatedUserToken: data.authenticatedUserToken,
    };
    const chunks = chunkPayload(
      payload,
      ['objectIDs', 'objectData'],
      MAX_OBJECT_IDS
    );

    logger('sendEvents', chunks);
    aa('sendEvents', chunks);
    data.gtmOnSuccess();
    break;
  }

  case 'clickedFilters': {
    if (!isInitialized()) {
      logger('You need to call the "init" event first.');
      data.gtmOnFailure();
      break;
    }

    const payload: InsightsEvent = {
      eventType: 'click',
      eventName: data.eventName,
      filters: formatValueToList(data.filters),
      index: data.index,
      userToken: data.userToken,
      authenticatedUserToken: data.authenticatedUserToken,
    };
    const chunks = chunkPayload(payload, ['filters'], MAX_FILTERS);

    logger('sendEvents', chunks);
    aa('sendEvents', chunks);
    data.gtmOnSuccess();
    break;
  }

  case 'convertedObjectIDsAfterSearch': {
    if (!isInitialized()) {
      logger('You need to call the "init" event first.');
      data.gtmOnFailure();
      break;
    }

    const payload: InsightsEvent = {
      eventType: 'conversion',
      eventName: data.eventName,
      index: data.index,
      objectIDs: formatValueToList(data.objectIDs),
      objectData: transformObjectData(data.objectData),
      queryID: data.queryID,
      userToken: data.userToken,
      authenticatedUserToken: data.authenticatedUserToken,
      value: data.value,
      currency: data.currency,
    };
    if (data.eventSubtype) {
      payload.eventSubtype = data.eventSubtype;
    }
    const chunks = chunkPayload(
      payload,
      ['objectIDs', 'objectData'],
      MAX_OBJECT_IDS
    );

    logger('sendEvents', chunks);
    aa('sendEvents', chunks);
    data.gtmOnSuccess();
    break;
  }

  case 'convertedObjectIDs': {
    if (!isInitialized()) {
      logger('You need to call the "init" event first.');
      data.gtmOnFailure();
      break;
    }

    const payload: InsightsEvent = {
      eventType: 'conversion',
      eventName: data.eventName,
      index: data.index,
      objectIDs: formatValueToList(data.objectIDs),
      objectData: transformObjectData(data.objectData),
      userToken: data.userToken,
      authenticatedUserToken: data.authenticatedUserToken,
      value: data.value,
      currency: data.currency,
    };
    if (data.eventSubtype) {
      payload.eventSubtype = data.eventSubtype;
    }
    const chunks = chunkPayload(
      payload,
      ['objectIDs', 'objectData'],
      MAX_OBJECT_IDS
    );

    logger('sendEvents', chunks);
    aa('sendEvents', chunks);
    data.gtmOnSuccess();
    break;
  }

  case 'convertedFilters': {
    if (!isInitialized()) {
      logger('You need to call the "init" event first.');
      data.gtmOnFailure();
      break;
    }

    const payload: InsightsEvent = {
      eventType: 'conversion',
      eventName: data.eventName,
      filters: formatValueToList(data.filters),
      index: data.index,
      userToken: data.userToken,
      authenticatedUserToken: data.authenticatedUserToken,
      value: data.value,
      currency: data.currency,
    };
    if (data.eventSubtype) {
      payload.eventSubtype = data.eventSubtype;
    }
    const chunks = chunkPayload(payload, ['filters'], MAX_FILTERS);

    logger('sendEvents', chunks);
    aa('sendEvents', chunks);
    data.gtmOnSuccess();
    break;
  }

  case 'viewedFilters': {
    if (!isInitialized()) {
      logger('You need to call the "init" event first.');
      data.gtmOnFailure();
      break;
    }

    const payload: InsightsEvent = {
      eventType: 'view',
      eventName: data.eventName,
      filters: formatValueToList(data.filters),
      index: data.index,
      userToken: data.userToken,
      authenticatedUserToken: data.authenticatedUserToken,
    };
    const chunks = chunkPayload(payload, ['filters'], MAX_FILTERS);

    logger('sendEvents', chunks);
    aa('sendEvents', chunks);
    data.gtmOnSuccess();
    break;
  }

  default: {
    logger('You need to set the method for this event.');
    (data as GtmWithMethod).gtmOnFailure();
  }
}
