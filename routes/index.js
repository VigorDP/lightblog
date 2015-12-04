var Index=require('../controllers/index.js');
module.exports = function(app) {
	app.get('/', Index.index);
}
