/**
 * Generic external-store connector.
 *
 * Configure a store in `externalStores` and call `ExternalStoreConnector.connect()`
 * from your page. Never put private API keys or access tokens in browser code;
 * use a secure backend/proxy for authenticated store APIs.
 */
const externalStores = {
  // Example:
  // shop: {
  //   name: "My external store",
  //   url: "https://shop.example.com",
  //   apiBaseUrl: "https://api.example.com"
  // }
};

class ExternalStoreConnector {
  static getStore(name) {
    const store = externalStores[name];

    if (!store || !store.url) {
      throw new Error(`External store "${name}" is not configured.`);
    }

    return store;
  }

  static connect(name) {
    const store = this.getStore(name);
    window.location.href = store.url;
  }

  static async request(name, path, options = {}) {
    const store = this.getStore(name);

    if (!store.apiBaseUrl) {
      throw new Error(`No API base URL configured for "${name}".`);
    }

    const response = await fetch(`${store.apiBaseUrl.replace(/\\/$/, "")}/${path.replace(/^\\//, "")}`, {
      ...options,
      headers: {
        Accept: "application/json",
        ...(options.body ? { "Content-Type": "application/json" } : {}),
        ...(options.headers || {})
      }
    });

    if (!response.ok) {
      throw new Error(`Store request failed: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }
}

// Expose the connector for use by inline scripts or other browser modules.
window.ExternalStoreConnector = ExternalStoreConnector;
