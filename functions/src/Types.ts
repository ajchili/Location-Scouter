export interface Account {
  tier: AccountTier;
  type: AccountType;
}
export type AccountTier = 'admin' | 'sponsored' | 'plus' | 'basic' | 'none';
export type AccountType = 'admin' | 'user' | 'unauthenticated';
export type APIKeyName = 'map' | 'streetview';
