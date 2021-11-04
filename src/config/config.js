const config = {
  host: process.env.HOST || '0.0.0.0',
  port: process.env.PORT || '3000',
  dbUrl: process.env.DB_URI,
  jwtSecret: process.env.JWT_SECRET,
  sendgrid: {
    apiKey: process.env.SENDGRID_API_KEY,
    from: {
      name: process.env.SENDGRID_FROM_NAME,
      email: process.env.SENDGRID_FROM_EMAIL,
    },
  },
}

module.exports = config;