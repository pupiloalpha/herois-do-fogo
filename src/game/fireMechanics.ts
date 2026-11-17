export interface FireSpreadUpdateResult {
  nextSpeed: number;
  increased: boolean;
}

const FIRE_SPREAD_STEP = 0.12;
const MAX_FIRE_SPREAD_SPEED = 1.85;

/**
 * Increases the fire spread speed multiplier for the next floor
 * when the player completes the current floor with strictly more than 50% health.
 */
export function calculateNextFireSpreadSpeed(
  currentSpeed: number,
  remainingHealth: number,
  maxHealth: number
): FireSpreadUpdateResult {
  if (maxHealth <= 0) {
    return { nextSpeed: currentSpeed, increased: false };
  }

  const healthRatio = remainingHealth / maxHealth;
  if (healthRatio <= 0.5) {
    return { nextSpeed: currentSpeed, increased: false };
  }

  const nextSpeed = Math.min(
    MAX_FIRE_SPREAD_SPEED,
    Math.round((currentSpeed + FIRE_SPREAD_STEP) * 100) / 100
  );

  return {
    nextSpeed,
    increased: nextSpeed > currentSpeed,
  };
}
