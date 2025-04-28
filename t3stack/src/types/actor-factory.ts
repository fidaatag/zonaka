import type { ActorMethod } from '@dfinity/agent';

export interface ActorIdlFactory {
  greet: ActorMethod<[string], string>;
  predict: ActorMethod<
    [
      {
        latitude: number;
        longitude: number;
        averageScore: number;
      }
    ],
    string
  >;
}