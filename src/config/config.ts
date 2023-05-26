import 'dotenv/config';

interface Config {
  databaseURI: string;
  secretTokenKey: string;
}

export const getConfig = (): Config => {
  const databaseURI = process.env.MONGO_URI;
  const secretTokenKey = process.env.JWT_SECRET;

  try {
    if (!databaseURI) {
      throw new Error('Please provide a database URI');
    }

    if (!secretTokenKey) {
      throw new Error('Please provide a secret token key');
    }

    return {
      databaseURI,
      secretTokenKey,
    };
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};
