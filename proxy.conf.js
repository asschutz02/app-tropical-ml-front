const PROXY_CONFIG = [
  {
    context: ['/api'],
    target: 'https://tropical-ml-backend.herokuapp.com/',
    secure: true,
    logLevel: 'debug',
    pathRewrite: { '^/api': ''}
  }

];

module.exports = PROXY_CONFIG;
