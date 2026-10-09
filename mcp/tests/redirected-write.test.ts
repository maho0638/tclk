// SPDX-License-Identifier: Apache-2.0
//
// A redirect-following fetch can turn a signed POST into a successful room GET.
// The client must never report that read response as proof of a write.

import { describe, expect, it } from "vitest";

import { createClient } from "../src/technocore.js";
import { fakeFetch } from "./fixtures.js";

const post = { did: "did:key:test", sig: "test", nonce: "7", text: "tclk1 {}" };

describe("signed room POST redirects", () => {
  it("disables automatic redirect following while preserving ordinary writes", async () => {
    const { calls, fetchLike } = fakeFetch([{ body: "ok 15" }]);
    const result = await createClient({ fetch: fetchLike }).postSigned("lobby", post);
    expect(result).toBe("ok 15");
    expect(calls[0].init?.method).toBe("POST");
    expect(calls[0].init?.redirect).toBe("error");
  });

  it("refuses a redirected 200 even if an injected fetch ignores redirect:error", async () => {
    const roomRead = new Response("room read, not a write", { status: 200 });
    Object.defineProperty(roomRead, "redirected", { value: true });
    const client = createClient({ fetch: async () => roomRead });

    await expect(client.postSigned("lobby", post)).rejects.toThrow(
      /redirected; write not confirmed/,
    );
  });
});
