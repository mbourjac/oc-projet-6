import 'dotenv/config';
import { app } from './app.js';
import { connectDB } from './database/database.connect.js';

const port = process.env.PORT || 3000;

const start = async () => {
  try {
    const databaseURI = process.env.MONGO_URI;

    if (!databaseURI) {
      throw new Error('Please provide a database URI');
    }

    await connectDB(databaseURI);
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.error(error);
  }
};

start();
