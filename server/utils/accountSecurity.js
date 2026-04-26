import db from "../config/db.js";

export const MAX_SECURITY_ATTEMPTS = 3;
export const SECURITY_BLOCK_DURATION_MS = 60 * 60 * 1000;

const ensuredColumnKeys = new Set();

export const ensureTableColumns = async ({ key, table, definitions }) => {
  if (ensuredColumnKeys.has(key)) return;

  await db.query(`
    ALTER TABLE ${table}
    ${definitions.map((definition) => `ADD COLUMN IF NOT EXISTS ${definition}`).join(",\n    ")}
  `);

  ensuredColumnKeys.add(key);
};

export const buildSecurityMeta = (
  record = {},
  {
    attemptsKey = "attempts",
    blockedUntilKey = "blocked_until",
    maxAttempts = MAX_SECURITY_ATTEMPTS,
  } = {}
) => {
  const attempts = Number(record[attemptsKey] || 0);

  return {
    remainingTries: Math.max(0, maxAttempts - attempts),
    blockedUntil: record[blockedUntilKey] || null,
  };
};

export const isSecurityBlocked = (record = {}, blockedUntilKey = "blocked_until") => {
  const blockedUntil = record[blockedUntilKey];
  return Boolean(blockedUntil && new Date(blockedUntil) > new Date());
};

export const clearSecurityAttempts = async ({
  table,
  keyColumn,
  keyValue,
  attemptsKey = "attempts",
  blockedUntilKey = "blocked_until",
}) => {
  await db.query(
    `UPDATE ${table} SET ${attemptsKey} = 0, ${blockedUntilKey} = NULL WHERE ${keyColumn} = ?`,
    [keyValue]
  );
};

export const resetSecurityAttemptsIfExpired = async ({
  record = {},
  table,
  keyColumn,
  keyValue,
  attemptsKey = "attempts",
  blockedUntilKey = "blocked_until",
}) => {
  const blockedUntil = record[blockedUntilKey];

  if (!blockedUntil) return false;

  if (new Date(blockedUntil) > new Date()) {
    return false;
  }

  await clearSecurityAttempts({
    table,
    keyColumn,
    keyValue,
    attemptsKey,
    blockedUntilKey,
  });

  record[attemptsKey] = 0;
  record[blockedUntilKey] = null;

  return true;
};

export const buildBlockedResponse = (
  record = {},
  {
    message = "Too many attempts. Try again after 1 hour.",
    attemptsKey = "attempts",
    blockedUntilKey = "blocked_until",
    blockedFlag = "securityBlocked",
    maxAttempts = MAX_SECURITY_ATTEMPTS,
  } = {}
) => ({
  status: 429,
  body: {
    message,
    [blockedFlag]: true,
    ...buildSecurityMeta(record, { attemptsKey, blockedUntilKey, maxAttempts }),
  },
});

export const registerFailedSecurityAttempt = async ({
  table,
  keyColumn,
  keyValue,
  currentAttempts = 0,
  attemptsKey = "attempts",
  blockedUntilKey = "blocked_until",
  invalidMessage = "Invalid attempt.",
  blockedMessage = "Too many attempts. Try again after 1 hour.",
  blockedFlag = "securityBlocked",
  maxAttempts = MAX_SECURITY_ATTEMPTS,
  blockDurationMs = SECURITY_BLOCK_DURATION_MS,
}) => {
  const nextAttempts = Number(currentAttempts || 0) + 1;

  if (nextAttempts >= maxAttempts) {
    const blockedUntil = new Date(Date.now() + blockDurationMs);

    await db.query(
      `UPDATE ${table} SET ${attemptsKey} = ?, ${blockedUntilKey} = ? WHERE ${keyColumn} = ?`,
      [maxAttempts, blockedUntil, keyValue]
    );

    return buildBlockedResponse(
      {
        [attemptsKey]: maxAttempts,
        [blockedUntilKey]: blockedUntil,
      },
      {
        message: blockedMessage,
        attemptsKey,
        blockedUntilKey,
        blockedFlag,
        maxAttempts,
      }
    );
  }

  await db.query(
    `UPDATE ${table} SET ${attemptsKey} = ?, ${blockedUntilKey} = NULL WHERE ${keyColumn} = ?`,
    [nextAttempts, keyValue]
  );

  return {
    status: 400,
    body: {
      message: invalidMessage,
      [blockedFlag]: false,
      ...buildSecurityMeta(
        {
          [attemptsKey]: nextAttempts,
          [blockedUntilKey]: null,
        },
        {
          attemptsKey,
          blockedUntilKey,
          maxAttempts,
        }
      ),
    },
  };
};
