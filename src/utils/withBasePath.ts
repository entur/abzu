const ROOT_PATH = "/";

/**
 * Returns the path prefixed with the application base path, so that it can be
 * pushed to a history that has no basename. Inverse of stripBasePath.
 */
export const withBasePath = (path: string, basePath: string): string => {
  const normalizedBase = basePath.replace(/\/+$/, "");
  const relativePath = path.replace(/^\/+/, "");
  return `${normalizedBase}${ROOT_PATH}${relativePath}`;
};
