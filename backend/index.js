require('dotenv').config()
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const categoryRouter = require('./routes/categoryRouter')
const serviceRouter = require('./routes/serviceRouter')
const { authenticateJWT } = require('./middleware/auth');
const authRoutes = require('./routes/auth');

const app = express();

app.use(bodyParser.json());
app.use(cors());

app.use('/api', authRoutes);
app.use(authenticateJWT); 
app.use('/api', categoryRouter)
app.use('/api', serviceRouter)

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
