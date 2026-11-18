import { lookup } from "node:dns/promises";
import { isIP } from "node:net";
import ipaddr from "ipaddr.js";
import { HttpError } from "../middleware/errors.js";

function isPublicAddress(address) {
  try {
    return ipaddr.process(address).range() === "unicast";
  } catch {
    return false;
  }
}

export async function assertPublicWalletUrl(value, { allowQuery = false } = {}) {
  let url;
  try {
    url = new URL(value);
  } catch {
    throw new HttpError(400, "Enter a valid HTTPS Open Payments wallet address.");
  }

  const hostname = url.hostname.toLowerCase();
  if (
    url.protocol !== "https:" ||
    url.username ||
    url.password ||
    url.port ||
    (!allowQuery && url.search) ||
    url.hash ||
    hostname === "localhost" ||
    hostname.endsWith(".localhost") ||
    hostname.endsWith(".local") ||
    isIP(hostname)
  ) {
    throw new HttpError(400, "Enter a public HTTPS Open Payments wallet address.");
  }

  let addresses;
  try {
    addresses = await lookup(hostname, { all: true, verbatim: true });
  } catch {
    throw new HttpError(400, "The Open Payments wallet address could not be resolved.");
  }

  if (!addresses.length || addresses.some(({ address }) => !isPublicAddress(address))) {
    throw new HttpError(400, "The Open Payments wallet address must resolve to a public network.");
  }

  return url.href;
}
