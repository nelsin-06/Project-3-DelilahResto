module.exports = {
  apps: [{
    name: 'APIREST',
    script: 'npm start',
    watch: 'true',
    env_production: {
      'PORT': '3000',
      'MONGODB_HOST': 'ApiDelilahRestoNel',
      'MONGODB_PASS': 'Gt2wVhLrs7WC5u6J',
      'MONGODB_NAME_DATABASE': 'apidelilah',
      'SALT_BCRYPT': 10,
      'PASS': 'ANDLIa7dsyoq8wgdblashdO7ADYO87QdhiQDO892qeHQOñ',
    },
  }, {
    name: 'API-TEST',
    script: 'npm test',
    watch: 'true',
    env_test: {
      'MONGODB_HOST': 'ApiDelilahRestoNel',
      'MONGODB_PASS': 'Gt2wVhLrs7WC5u6J',
      'MONGODB_NAME_DATABASE': 'apidelilah',
      'SALT_BCRYPT': 10,
      'PASS': 'ANDLIa7dsyoq8wgdblashdO7ADYO87QdhiQDO892qeHQOñ',
    }
  }]
};
