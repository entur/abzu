const ROOT_PATH = "/";

/**
 * Returns the path relative to the application base path, always with a
 * leading slash. A path that does not start with the base path is returned
 * unchanged.
 */
export const stripBasePath = (pathname: string, basePath: string): string => {
  const normalizedBase = basePath.replace(/\/+$/, "");
  if (normalizedBase === "") {
    return pathname;
  }
  if (pathname === normalizedBase) {
    return ROOT_PATH;
  }
  if (pathname.startsWith(`${normalizedBase}/`)) {
    return pathname.slice(normalizedBase.length);
  }
  return pathname;
};
