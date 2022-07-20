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

export async function fetchBalance(api: ApiPromise, address: string) {
  console.log(api, address);
  try {
    const balance = await api.query.assets.account(
      String("340282366920938463463374607431768211455"),
      address
    );
    return balance.toString();
  } catch (error) {
    console.error(error);
    return "0";
  }
}

export function formatBalance(
  balance: string,
  tokenDecimals: string | undefined
) {
  return Number(utils.formatUnits(balance, tokenDecimals)).toFixed(2);
}

export const fetchNativeBalance = async ({
  api,
  address,
}: {
  api: ApiPromise;
  address: string;
}) => {
  try {
    const accountInfo = await api.query.system.account<SystemAccount>(address);
    const balance = accountInfo.data.free;
    return balance.toString();
  } catch (error) {
    console.error(error);
    return "0";
  }
};
