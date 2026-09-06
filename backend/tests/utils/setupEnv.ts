if (!process.env.TEST_DATABASE_URL) {
  throw new Error(
    "TEST_DATABASE_URL is not set. Add it to your .env file before running tests."
  );
}

process.env.DATABASE_URL = process.env.TEST_DATABASE_URL;