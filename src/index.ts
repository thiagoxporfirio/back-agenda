import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import { AppDataSource } from './database/data-source';
import routes from '../Router';


const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(cors());
app.use(express.json());

// Rotas
app.use('/api', routes);

// Inicializar DB e servidor
AppDataSource.initialize()
  .then(() => {
    console.log('📦 Banco de dados conectado');
    app.listen(PORT, () => {
      console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
    });
  })
  .catch((error: Error) => {
    console.error('❌ Erro ao conectar no banco de dados:', error);
  });