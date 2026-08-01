import PocketBase from "pocketbase";

const PB_URL = process.env.NEXT_PUBLIC_POCKETBASE_URL!;

// Browser singleton
let pbInstance: PocketBase | null = null;

export function getPocketBase(): PocketBase {
  if (typeof window === "undefined") {
    // Server: new instance per request
    return new PocketBase(PB_URL);
  }
  // Client: singleton
  if (!pbInstance) {
    pbInstance = new PocketBase(PB_URL);
    pbInstance.authStore.loadFromCookie(document.cookie);
  }
  return pbInstance;
}
