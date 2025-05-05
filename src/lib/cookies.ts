/**
 * Get a cookie by name
 */
export function getCookie(name: string): string | undefined {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return parts.pop()?.split(";").shift();
  }
  return undefined;
}

/**
 * Set a cookie with options
 */
export function setCookie(
  name: string,
  value: string,
  options: {
    days?: number;
    path?: string;
    sameSite?: string;
    secure?: boolean;
  } = {}
): void {
  const { days = 7, path = "/", sameSite = "strict", secure = true } = options;

  const expires = new Date(Date.now() + days * 864e5).toUTCString();

  document.cookie = `${name}=${encodeURIComponent(
    value
  )}; expires=${expires}; path=${path}; samesite=${sameSite}${
    secure ? "; secure" : ""
  }`;
}

/**
 * Delete a cookie by name
 */
export function deleteCookie(name: string): void {
  setCookie(name, "", { days: -1 });
}
