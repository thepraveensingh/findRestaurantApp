require('dotenv').config();

module.exports = {
  mongoURI: process.env.MONGO_URI || 'mongodb+srv://yugmodi284:28012003@cluster0.vgb0q.mongodb.net/my-db?retryWrites=true&w=majority&appName=Cluster0',
};