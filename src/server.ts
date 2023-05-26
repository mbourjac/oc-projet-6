import 'dotenv/config';
import { app } from './app';
import { connectDB } from './database/database.connect';
import { getConfig } from './config/config';

const port = process.env.PORT || 3000;

const start = async () => {
  try {
    const { databaseURI } = getConfig();

    await connectDB(databaseURI);
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.error(error);
  }
};

start();
