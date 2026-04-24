export const MAX_OTP_TRIES = 3;

export const getRemainingTries = (value) => {
  const tries = Number(value);
  if (!Number.isFinite(tries)) return MAX_OTP_TRIES;
  return Math.max(0, Math.min(MAX_OTP_TRIES, tries));
};

export const getBlockTimeLeft = (blockedUntil) => {
  if (!blockedUntil) return 0;

  const target = new Date(blockedUntil).getTime();
  if (Number.isNaN(target)) return 0;

  return Math.max(0, target - Date.now());
};

export const formatDuration = (ms) => {
  const totalSeconds = Math.max(0, Math.ceil(ms / 1000));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  }

  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
};

export const normalizeOtpResponse = (data = {}) => ({
  message: data.message || "",
  remainingTries: getRemainingTries(data.remainingTries),
  blockedUntil: data.blockedUntil || null,
  otpBlocked: Boolean(data.otpBlocked),
  otpExpired: Boolean(data.otpExpired),
});
