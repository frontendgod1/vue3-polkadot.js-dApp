import type { ChainInfo } from "@/hooks/useChainInfo";

export type SubstrateAccount = {
  address: string;
  name: string;
  source: string;
  balance?: string;
};

export interface GeneralStateInterface {
  api: any;
  connected: boolean;
  chainInfo: ChainInfo | undefined;
  extensionCount: number;
  substrateAccounts: SubstrateAccount[];
  currentAddress: string;
  currentNetworkStatus: ConnectionType;
  currentWallet: string;
}

export type ConnectionType = "connected" | "connecting" | "offline";

function state(): GeneralStateInterface {
  return {
    api: undefined,
    connected: false,
    chainInfo: undefined,
    extensionCount: 0,
    substrateAccounts: [],
    currentNetworkStatus: "offline",
    currentAddress: "",
    currentWallet: "",
  };
}

export default state;
