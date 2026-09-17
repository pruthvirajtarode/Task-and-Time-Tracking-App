import 'dotenv/config';
import app from './app';
import prisma from './config/db';

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // Attempt to connect to the database
    await prisma.$connect();
    console.log('Successfully connected to the database');

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
