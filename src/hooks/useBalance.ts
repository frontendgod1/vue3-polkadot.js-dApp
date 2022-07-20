import type { ApiPromise } from "@polkadot/api";
import type { Struct } from "@polkadot/types";
import type BN from "bn.js";
import { utils } from "ethers";

export interface SystemAccount extends Struct {
  data: {
    free: BN;
    reserved: BN;
    miscFrozen: BN;
    feeFrozen: BN;
  };
}

export function useBalance(api: ApiPromise) {}

export function formatBalance(balance: string, tokenDecimals: string) {
  return Number(utils.formatUnits(balance, tokenDecimals)).toFixed(2);
}

export const fetchNativeBalance = async ({
  api,
  address,
}: {
  api: ApiPromise;
  address: string;
}) => {
  console.log(api);
  try {
    const accountInfo = await api.query.system.account<SystemAccount>(address);
    const balance = accountInfo.data.free;
    return balance.toString();
  } catch (error) {
    console.error(error);
    return "0";
  }
};
