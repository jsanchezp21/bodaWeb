import mongoose from 'mongoose';

export async function connectDatabase() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error('Falta MONGODB_URI en las variables de entorno');
  }

  await mongoose.connect(uri);
  console.log('Base de datos conectada');
}
