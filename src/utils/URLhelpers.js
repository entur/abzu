/*
 *  Licensed under the EUPL, Version 1.2 or – as soon they will be approved by
 the European Commission - subsequent versions of the EUPL (the "Licence");
 You may not use this work except in compliance with the Licence.
 You may obtain a copy of the Licence at:

 https://joinup.ec.europa.eu/software/page/eupl

 Unless required by applicable law or agreed to in writing, software
 distributed under the Licence is distributed on an "AS IS" basis,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the Licence for the specific language governing permissions and
 limitations under the Licence. */

const getBaseUrl = () => {
  return [
    window.location.protocol,
    '//',
    window.location.host,
    window.location.pathname
  ].join('');
};

const createParamforUrl = (key, value, isFirst) => {
  if (!key) { return '' }

  const paramStart = isFirst ? '?' : '&';

  switch (typeof value) {
    case "string":
      if (!value) return '';
    case "object":
      if (Array.isArray(value) && !value.length) return '';
      if (value === null) return '';
    default: break;
  }

  return paramStart + `${key}=${value}`;
};

const getURLWithParam = (key, value) => {
  let baseUrl = getBaseUrl();
  let urlQueryString = document.location.search;
  let params = key + '=' + value;
  let newParams = '?' + params;

  if (!urlQueryString) {
    return baseUrl + newParams;
  }

  const updateRE = new RegExp('([?&])' + key + '[^&]*');
  const removeRE = new RegExp('([?&])' + key + '=[^&;]+[&;]?');

  if (!value) {
    params = urlQueryString.replace(removeRE, '$1');
    params = params.replace(/[&;]$/, '');

    // Remove question mark if id was only param
    if (params === '?') {
      params = '';
    }

  } else if (urlQueryString.match(updateRE) !== null) {
    params = urlQueryString.replace(updateRE, '$1' + params);
  } else {
    params = urlQueryString + '&' + newParams;
  }

  return baseUrl + params;
};

const updateURL = url => {
  window.history.pushState({}, null, url);
};

const getParamsFromURL = query => {
  if (!query) {
    return {};
  }

  return (/^[?#]/.test(query) ? query.slice(1) : query)
    .split('&')
    .reduce((params, param) => {
      let [key, value] = param.split('=');
      params[key] = value ? decodeURIComponent(value.replace(/\+/g, ' ')) : '';
      return params;
    }, {});
};

export const updateURLWithId = (key, id) => {
  if (id) {
    let url = getUrlWithOnlyParam(key, id);
    updateURL(url);
  }
};

export const getUrlWithOnlyParam = (key, id) => {
  return getBaseUrl() + `?${key}=${id}`
};

export const removeIdParamFromURL = id => {
  updateURL(getURLWithParam(id, null));
};

export const buildReportSearchQuery = params => {
  const baseUrl = getBaseUrl();
  let queryString = '';
  Object.keys(params).forEach((key) => {
    queryString += createParamforUrl(key, params[key], queryString === '')
  });
  updateURL(baseUrl + encodeURI(queryString));
};

export const extractQueryParamsFromUrl = () => {
  const urlQueryString = document.location.search;
  return getParamsFromURL(urlQueryString);
};

export const getStopPlaceIdFromURL = () => getParamsFromURL(window.location.search).stopPlaceId;

export const getGroupOfStopPlacesIdFromURL = () => getParamsFromURL(window.location.search).groupOfStopPlacesId;
