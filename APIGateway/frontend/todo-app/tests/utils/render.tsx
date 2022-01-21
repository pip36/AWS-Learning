import { render as testingLibraryRender } from "@testing-library/react";
import { rest } from "msw";
import { server } from "../mocks/server";

export const render = (el: React.ReactElement) => {
  const result = testingLibraryRender(el);

  return {
    ...result,
    refreshPage: () => {
      result.unmount();
      testingLibraryRender(el);
    },
  };
};

export const stubApi500Error = (url: string) =>
  server.use(
    rest.get(url, (_, res, ctx) => res(ctx.status(500), ctx.json({})))
  );

export const stubApiNetworkError = (url: string) =>
  server.use(rest.get(url, (_, res) => res.networkError("Failed to connect.")));
