import { fav } from '@/util/const';
import type { Fav } from '@/types/user'


export const favOptions = Object.entries(fav).map(([_key, text]) => {
  // jsの仕様でobjectのkeyはstringとなる為
  const value = parseInt(_key) as Fav;
  return { value, text } as const;
});
