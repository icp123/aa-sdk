import {
  isHex,
  type HDAccount,
  type Hex,
  type LocalAccount,
  type PrivateKeyAccount,
} from "viem";
import { mnemonicToAccount, privateKeyToAccount } from "viem/accounts";
import type { SignTypedDataParams } from "../account/types.js";
import type { SmartAccountSigner } from "./types.js";

export class LocalAccountSigner<
  T extends HDAccount | PrivateKeyAccount | LocalAccount
> implements SmartAccountSigner
{
  private owner: T;
  signerType: string;

  constructor(owner: T) {
    this.owner = owner;
    this.signerType = owner.type; //  type: "local"
  }

  readonly signMessage: (msg: string | Uint8Array) => Promise<`0x${string}`> = (
    msg
  ) => {
    if (typeof msg === "string" && !isHex(msg)) {
      return this.owner.signMessage({
        message: msg,
      });
    } else {
      return this.owner.signMessage({
        message: {
          raw: msg,
        },
      });
    }
  };

  readonly signTypedData = (params: SignTypedDataParams) => {
    return this.owner.signTypedData(params);
  };

  readonly getAddress: () => Promise<`0x${string}`> = async () => {
    return this.owner.address;
  };

  static mnemonicToAccountSigner(key: string): LocalAccountSigner<HDAccount> {
    const owner = mnemonicToAccount(key);
    return new LocalAccountSigner(owner);
  }

  static privateKeyToAccountSigner(
    key: Hex
  ): LocalAccountSigner<PrivateKeyAccount> {
    const owner = privateKeyToAccount(key);
    return new LocalAccountSigner(owner);
  }
}
