import { endpointKey } from "../../config/chainEndPoint";

export type SubstrateAccount = {
  address: string;
  name: string;
  source: string;
  balance?: string;
};

export interface GeneralStateInterface {
  connected: boolean;
  chainInfo: any;
  extensionCount: number;
  substrateAccounts: SubstrateAccount[];
  currentNetworkIdx: number;
  currentAddress: string;
  currentNetworkStatus: ConnectionType;
  currentWallet: string;
}

export type ConnectionType = "connected" | "connecting" | "offline";

function state(): GeneralStateInterface {
  return {
    connected: false,
    chainInfo: undefined,
    extensionCount: 0,
    substrateAccounts: [],
    currentNetworkIdx: endpointKey.SHIDEN,
    currentNetworkStatus: "offline",
    currentAddress: "",
    currentWallet: "",
  };
}

export default state;
