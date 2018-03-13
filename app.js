const BigchainDB = require('bigchaindb-driver');
const bip39 = require('bip39');
const DID = require('./DID');
const config = require('./config.json');

const conn = new BigchainDB.Connection(config.API_PATH,
{
    app_id: config.app_id,
    app_key: config.app_key
});

const updateMileage = async (did, newMileage) =>
{
    // assets is an array of myModel
    // the retrieve asset contains the last (unspent) state
    // of the asset
    const assets = await did.myModel.retrieve(did.id);
    const updatedAsset = await assets[0].append(
    {
        toPublicKey: car.publicKey,
        keypair: car,
        data: {newMileage}
    });
    did.mileage =  updatedAsset.data.newMileage;
    console.log(`Transaction created, did: ${updatedAsset.id}`);
    return updatedAsset;
};

const main = async () =>
{
    let asset;
    const alice = new BigchainDB.Ed25519Keypair(bip39.mnemonicToSeed('seedPhrase').slice(0,32));
    const car = new BigchainDB.Ed25519Keypair();
    const sensorGPS = new BigchainDB.Ed25519Keypair();

    const userDID = new DID(alice.publicKey);
    const carDID = new DID(car.publicKey);
    const gpsDID = new DID(sensorGPS.publicKey);

    userDID.define('myModel', 'https://schema.org/v1/myModel');
    carDID.define('myModel', 'https://schema.org/v1/myModel');
    gpsDID.define('myModel', 'https://schema.org/v1/myModel');

    asset = await userDID.myModel.create(
    {
        keypair: alice,
        data:
        {
            name: 'Alice',
            bithday: '03/08/1910'
        }
    });

    userDID.id = `did: ${asset.id}`;
    console.log(`Transaction created, did: ${asset.id}`);

    const vehicle =
    {
        value: '6sd8f68sd67',
        power:
        {
            engine: '2.5',
            hp: '220 hp'
        },
        consumption: '10.8 l'
    };

    asset = await carDID.myModel.create(
    {
        keypair: alice,
        data:
        {
            vehicle
        }
    });
    carDID.id = `did: ${asset.id}`;
    console.log(`Transaction created, did: ${asset.id}`);

    asset = await gpsDID.myModel.create(
    {
        keypair: car,
        data:
        {
            gps_identifier: 'a32bc2440da012'
        }
    });
    gpsDID.id =  `did: ${asset.id}`;
    console.log(`Transaction created, did: ${asset.id}`);
    await updateMileage(carDID.id, 12345);
}

main();
