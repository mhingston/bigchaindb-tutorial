const Orm = require('bigchaindb-orm');
const config = require('./config.json');

class DID extends Orm
{
    constructor(entity)
    {
        super(config.API_PATH,
        {
            app_id: 'Get one from testnet.bigchaindb.com',
            app_key: 'Get one from testnet.bigchaindb.com'
        });
        this.entity = entity;
    }
}

module.exports = DID;