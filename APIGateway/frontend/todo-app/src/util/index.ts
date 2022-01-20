import { v4 as uuid } from "uuid";

export const randomUUID = (): string => uuid();

export const randomString = randomUUID;
