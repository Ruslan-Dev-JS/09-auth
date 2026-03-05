import { createProxyMiddleware } from "http-proxy-middleware";
import type { IncomingMessage, ServerResponse } from "http";
import type { NextApiRequest, NextApiResponse } from "next";

const API_URL = "https://notehub-api.goit.study";

const apiProxy = createProxyMiddleware({
  target: API_URL,
  changeOrigin: true,
  secure: true,
  cookieDomainRewrite: {
    "notehub-api.goit.study": "",
  },
  onProxyReq(proxyReq, req) {
    const cookie = (req as IncomingMessage).headers.cookie;
    if (cookie) {
      proxyReq.setHeader("cookie", cookie);
    }
  },
  onProxyRes(proxyRes, req, res) {
    const setCookieHeader = proxyRes.headers["set-cookie"];
    if (setCookieHeader) {
      (res as ServerResponse).setHeader("set-cookie", setCookieHeader);
    }
  },
});

export function proxy(req: NextApiRequest, res: NextApiResponse) {
  return new Promise<void>((resolve, reject) => {
    apiProxy(req, res, (result) => {
      if (result instanceof Error) {
        reject(result);
      } else {
        resolve();
      }
    });
  });
}

