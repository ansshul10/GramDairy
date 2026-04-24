/**
 * Sets Access and Refresh Token cookies in the response.
 */
export const setTokensInCookies = (res, accessToken, refreshToken) => {
  const isProduction = process.env.NODE_ENV === 'production';

  const cookieOptions = {
    httpOnly: true,
    secure: isProduction, // Use secure cookies in production
    sameSite: isProduction ? 'lax' : 'lax', // Use lax for better compatibility
    path: '/',
  };

  // Access Token Cookie
  res.cookie('accessToken', accessToken, {
    ...cookieOptions,
    maxAge: parseInt(process.env.COOKIE_ACCESS_MAX_AGE) || 15 * 60 * 1000, // 15 min
  });

  // Refresh Token Cookie
  res.cookie('refreshToken', refreshToken, {
    ...cookieOptions,
    maxAge: parseInt(process.env.COOKIE_REFRESH_MAX_AGE) || 7 * 24 * 60 * 60 * 1000, // 7 days
  });
};

/**
 * Clears Auth Cookies
 */
export const clearAuthCookies = (res) => {
  res.clearCookie('accessToken');
  res.clearCookie('refreshToken');
};
