// backend/src/index.ts
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import path from 'path';
import { listApartments, getApartment, createApartment, updateApartment, deleteApartment } from './controllers/apartments';

const app = express();
const PORT = Number(process.env.PORT) || 3001;

const swaggerDocument = YAML.load(path.join(__dirname, 'swagger.yaml'));

app.use(cors({
  origin: ['http://localhost:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

app.use(express.json());

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Routes
app.get('/api/apartments', listApartments);
app.get('/api/apartments/:id', getApartment);
app.post('/api/apartments', createApartment);
app.put('/api/apartments/:id', updateApartment);
app.delete('/api/apartments/:id', deleteApartment);

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://mongodb:27017/apartments')
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});