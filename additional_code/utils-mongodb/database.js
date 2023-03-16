const mongodb = require('mongodb');

const MongoClient = mongodb.MongoClient;

let _db;

const mongoConnect = (callback) => {
	MongoClient.connect(
		'mongodb+srv://bhav_somanchi:R2kLQmUPDyzshqYl@cluster0.cwzcopu.mongodb.net/shop?retryWrites=true&w=majority',
		{
			useNewUrlParser: true,
			useUnifiedTopology: true,
		}
	)
		.then((client) => {
			console.log('Connected to mongodb');
			_db = client.db()
			callback();
		})
		.catch((error) => {
			console.log(error);
			throw error;
		});
};

const getDb = () => {
	if(_db) {
		return _db;
	}
	throw 'No database found!';
}
exports.mongoConnect = mongoConnect;
exports.getDb = getDb;
