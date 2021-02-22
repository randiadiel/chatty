const path = require('path')

module.exports = {
    env: {
        'MYSQL_HOST': '127.0.0.1',
        'MYSQL_PORT': '3306',
        'MYSQL_DATABASE': 'chatty_db',
        'MYSQL_USER': 'root',
        'MYSQL_PASSWORD': '',
    },
    sassOptions: {
        includePaths: [path.join(__dirname, 'styles')],
    },
}
