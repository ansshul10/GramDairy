/**
 * Cookie configuration shared between set and clear operations.
 * IMPORTANT: When clearing cookies, the path/domain/httpOnly/secure/sameSite
 * options MUST match exactly what was used when setting them,
 * otherwise browsers will NOT delete the cookie.
 */
const getCookieOptions = () => {
  const isProduction = process.env.NODE_ENV === 'production';

  return {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
    path: '/',
  };
};

/**
 * Sets Access and Refresh Token cookies in the response.
 */
export const setTokensInCookies = (res, accessToken, refreshToken) => {
  const options = getCookieOptions();

  // Access Token Cookie
  res.cookie('accessToken', accessToken, {
    ...options,
    maxAge: parseInt(process.env.COOKIE_ACCESS_MAX_AGE) || 15 * 60 * 1000, // 15 min
  });

  // Refresh Token Cookie
  res.cookie('refreshToken', refreshToken, {
    ...options,
    maxAge: parseInt(process.env.COOKIE_REFRESH_MAX_AGE) || 7 * 24 * 60 * 60 * 1000, // 7 days
  });
};

/**
 * Clears Auth Cookies.
 * Uses the same options as setTokensInCookies to ensure browsers
 * actually delete the cookies.
 */
export const clearAuthCookies = (res) => {
  const options = getCookieOptions();

  res.clearCookie('accessToken', options);
  res.clearCookie('refreshToken', options);
};
