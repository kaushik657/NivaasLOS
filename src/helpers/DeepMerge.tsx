// utils/buildEVerificationPayload.ts
import { baseEVerification } from "../constants/baseEVerification";

// Infer the type of baseEVerification
type EVerification = typeof baseEVerification;

/**
 * Merges two flat objects and keeps type safety.
 */
const DeepMerge = (
  target: EVerification,
  source: Partial<EVerification>
): EVerification => {
  return { ...target, ...source };
};

export const buildEVerificationPayload = (
  updates: Partial<EVerification>
): EVerification => {
  // If updates is empty, return the base object as-is
  if (!updates || Object.keys(updates).length === 0) {
    return baseEVerification;
  }

  return DeepMerge(baseEVerification, updates);
};
