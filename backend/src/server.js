import 'dotenv/config';
import { app } from './app.js';
import { connectDatabase } from './config/database.js';

const port = process.env.PORT || 3000;

try {
  await connectDatabase();
  app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
  });
} catch (error) {
  console.error('No se pudo iniciar el servidor:', error);
  process.exit(1);
}
