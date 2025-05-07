const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.DB_PORT;

const userRoutes = require('./routes/userRoutes');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/users', userRoutes);

app.get('/', (req, res) => {
  res.status(200).send('Hello World');
});

app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    success: false,
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
});

const db = require('./models/main');
db.sequelize
  .sync()
  .then(() => console.log('Database synchronized successfully'))
  .catch((err) => console.error('Failed to sync database:', err.message));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
