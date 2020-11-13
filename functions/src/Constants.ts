import { APIKeyName, AccountTier } from './Types';

export const API_QUOTA_LIMITS: Record<
  APIKeyName,
  Record<AccountTier, number>
> = {
  map: {
    admin: Number.MAX_SAFE_INTEGER,
    sponsored: Number.MAX_SAFE_INTEGER,
    plus: 1000,
    basic: 250,
    none: 0,
  },
  streetview: {
    admin: Number.MAX_SAFE_INTEGER,
    sponsored: Number.MAX_SAFE_INTEGER,
    plus: 500,
    basic: 200,
    none: 0,
  },
};
