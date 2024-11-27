interface GtmWithMethod {
  method:
    | 'init'
    | 'setAuthenticatedUserToken'
    | 'viewedObjectIDs'
    | 'clickedObjectIDsAfterSearch'
    | 'clickedObjectIDs'
    | 'clickedFilters'
    | 'convertedObjectIDsAfterSearch'
    | 'convertedObjectIDs'
    | 'convertedFilters'
    | 'viewedFilters';
  gtmOnSuccess: () => void;
  gtmOnFailure: () => void;
}

interface GtmDataInit extends GtmWithMethod {
  method: 'init';
  appId: string;
  apiKey: string;
  init_authenticatedUserToken: string;
  userHasOptedOut: boolean;
  region: 'de' | 'us';
  cookieDuration: number;
  useCookie: boolean;
  host: string;
  useIIFE: boolean;
  initialUserToken: string;
}
interface GtmDataSetAuthenticatedUserToken extends GtmWithMethod {
  method: 'setAuthenticatedUserToken';
  setAuthenticatedUserToken_token: string;
}
interface GtmDataEvent extends GtmWithMethod {
  eventName: string;
  userToken: string;
  authenticatedUserToken: string;
}
interface GtmDataEventWithObjects extends GtmDataEvent {
  objectIDs: string[];
  objectData?: Array<Record<string, string | number | undefined>>;
}
interface GtmDataEventWithFilters extends GtmDataEvent {
  filters: string[];
}
interface GtmDataViewedObjectIDs extends GtmDataEventWithObjects {
  method: 'viewedObjectIDs';
  index: string;
}
interface GtmDataClickedObjectIDsAfterSearch extends GtmDataEventWithObjects {
  method: 'clickedObjectIDsAfterSearch';
  index: string;
  positions: number[];
  queryID: string;
}
interface GtmDataClickedObjectIDs extends GtmDataEventWithObjects {
  method: 'clickedObjectIDs';
  index: string;
  queryID?: string;
}
interface GtmDataClickedFilters extends GtmDataEventWithFilters {
  method: 'clickedFilters';
  index: string;
}
interface GtmDataConvertedObjectIDsAfterSearch extends GtmDataEventWithObjects {
  method: 'convertedObjectIDsAfterSearch';
  index: string;
  queryID: string;
  eventSubtype: GtmEventSubtype;
  currency?: string;
  value?: number | string;
}
interface GtmDataConvertedObjectIDs extends GtmDataEventWithObjects {
  method: 'convertedObjectIDs';
  index: string;
  eventSubtype: GtmEventSubtype;
  currency?: string;
  value?: number | string;
}
interface GtmDataConvertedFilters extends GtmDataEventWithFilters {
  method: 'convertedFilters';
  index: string;
  eventSubtype: GtmEventSubtype;
  currency?: string;
  value?: number | string;
}
interface GtmDataViewedFilters extends GtmDataEventWithFilters {
  method: 'viewedFilters';
  index: string;
}
type GtmData =
  | GtmDataInit
  | GtmDataSetAuthenticatedUserToken
  | GtmDataViewedObjectIDs
  | GtmDataClickedObjectIDsAfterSearch
  | GtmDataClickedObjectIDs
  | GtmDataClickedFilters
  | GtmDataConvertedObjectIDsAfterSearch
  | GtmDataConvertedObjectIDs
  | GtmDataConvertedFilters
  | GtmDataViewedFilters;

declare const data: GtmData;

type GtmEventSubtype = 'addToCart' | 'purchase' | '';

// Tag Manager Template Core APIs

type GtmGetType = (
  value: any
) =>
  | 'null'
  | 'undefined'
  | 'boolean'
  | 'number'
  | 'string'
  | 'array'
  | 'object'
  | 'function';

type GtmMakeInteger = (value: any) => number;

type GtmMath = Pick<
  Math,
  'abs' | 'floor' | 'ceil' | 'round' | 'max' | 'min' | 'pow' | 'sqrt'
>;

interface GtmObject {
  delete: (obj: Record<string, any>, key: string) => void;
  entries: (obj: Record<string, any>) => [string, any][];
  freeze: (obj: Record<string, any>) => Record<string, any>;
  keys: (obj: Record<string, any>) => string[];
  values: (obj: Record<string, any>) => any[];
}
