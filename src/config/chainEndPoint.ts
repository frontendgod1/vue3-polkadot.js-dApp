import Logo from "../assets/images/ic_shibuya.png";
import DefaultLogo from "../assets/images/ic_polkadot.png";

interface ChainProvider {
  chainName: string;
  endpoint: string;
  logo?: any;
}

export const providerEndpoints: ChainProvider[] = [
  {
    chainName: "Shibuya Network",
    endpoint: "wss://rpc.shibuya.astar.network",
    logo: Logo,
  },
];

export const xcmChainEndPoints: ChainProvider[] = [
  {
    chainName: "Kyoto Network",
    endpoint: "wss://kyoto.astar.network",
    logo: DefaultLogo,
  },
];
