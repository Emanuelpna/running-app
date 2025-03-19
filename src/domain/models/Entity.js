import * as Crypto from 'expo-crypto';

export class Entity {
  id = Crypto.randomUUID();
}
