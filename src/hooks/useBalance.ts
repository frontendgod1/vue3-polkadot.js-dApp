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

interface Account extends Struct {
  balance: string;
}

export async function fetchBalance(api: ApiPromise, address: string) {
  try {
    const result = await api.query.assets.account<Account>(
      String("340282366920938463463374607431768211455"),
      address
    );
    const data = result.toJSON();
    console.log(data);
    const balance = data ? String(data.balance) : "0";
    return balance;
  } catch (error) {
    console.error(error);
    return "0";
  }
}

export function formatBalance(balance: any, tokenDecimals: string | undefined) {
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
