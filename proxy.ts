import type { NextApiRequest, NextApiResponse } from "next";

export function proxy(req: NextApiRequest, res: NextApiResponse) {
  // Stub implementation for route protection via Proxy, according to HW requirements.
  // Actual protection is handled via AuthProvider and API routes.
  return Promise.resolve();
}
