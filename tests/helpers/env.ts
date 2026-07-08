const requiredEnvKeys = [
  'TEST_USER_STANDARD',
  'TEST_USER_LOCKED_OUT',
  'TEST_USER_PROBLEM',
  'TEST_USER_PERFORMANCE_GLITCH',
  'TEST_USER_ERROR',
  'TEST_USER_VISUAL',
  'TEST_PASSWORD',
] as const;

type RequiredEnvKey = (typeof requiredEnvKeys)[number];

const missingKeys = requiredEnvKeys.filter((key) => !process.env[key]);

if (missingKeys.length > 0) {
  throw new Error(`Missing required environment variables: ${missingKeys.join(', ')}`);
}

export function getRequiredEnv(key: RequiredEnvKey): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }

  return value;
}