export default () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  env: process.env.NODE_ENV,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpirationTime: process.env.JWT_EXPIRATION_TIME,
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET,
  jwtRefreshExpirationTime: process.env.JWT_REFRESH_EXPIRATION_TIME,
});
