import { useChainInfo } from "@/hooks/useChainInfo";
import { ApiPromise, WsProvider } from "@polkadot/api";

const RES_INVALID_CONNECTION = "invalid connection";
const RES_CONNECTED_API = "connected";
const RES_TIMEOUT = "timeout";

const fallbackConnection = async ({
  endpoint,
}: {
  endpoint: string;
}): Promise<void> => {
  try {
    const resolveApiStatus = new Promise<string>((resolve) => {
      const provider = new WsProvider(endpoint);
      const api = new ApiPromise({ provider });

      api.isReadyOrError.then(async () => {
        const result = await api.rpc.system.health();
        const isHealthy = result.toHuman().shouldHavePeers;
        if (isHealthy) {
          resolve(RES_CONNECTED_API);
        } else {
          resolve(RES_INVALID_CONNECTION);
        }
      });
    });

    const fallbackTimeout = new Promise<string>(async (resolve) => {
      resolve(RES_TIMEOUT);
    });

    const race = Promise.race<string>([resolveApiStatus, fallbackTimeout]);
    race.then((res: string) => {
      if (res === RES_CONNECTED_API) {
        return window.location.reload();
      } else {
        return;
      }
    });
  } catch (error) {
    console.error(error);
  }
};

export async function connectApi(
  store: any,
  endpoint: string
): Promise<{
  api: ApiPromise;
}> {
  const provider = new WsProvider(endpoint);
  const api = new ApiPromise({ provider });

  store.commit("account/setCurrentNetworkStatus", "connecting");

  api.on("error", (error: Error) => console.error(error.message));

  try {
    const apiConnect = new Promise<string>((resolve) => {
      api.isReadyOrError.then(() => {
        resolve(RES_CONNECTED_API);
      });
    });

    const fallbackTimeout = new Promise<string>(async (resolve) => {
      resolve(RES_TIMEOUT);
    });

    const race = Promise.race<string>([apiConnect, fallbackTimeout]);
    race.then((res: string) => {
      if (res === RES_TIMEOUT) {
        fallbackConnection({ endpoint });
      }
    });
  } catch (e) {
    console.error(e);
    fallbackConnection({ endpoint });
  }

  try {
    await api.isReady;

    store.commit("account/setCurrentNetworkStatus", "connected");
  } catch (err) {
    console.error(err);
    fallbackConnection({ endpoint });
  }

  return {
    api,
  };
}
