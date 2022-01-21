import "whatwg-fetch";
import "@testing-library/jest-dom";
import { server } from "./mocks/server";
import db from "./mocks/db";

beforeAll(() => {
  db.seed();
  server.listen();
});
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
