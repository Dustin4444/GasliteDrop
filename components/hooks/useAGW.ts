import { useEffect, useState, useMemo } from "react";
import { getBytecode } from "@wagmi/core";
import { config } from "@/lib/wagmi";
import { abstract } from "viem/chains";
import { getGeneralPaymasterInput } from "viem/zksync";
import { useAbstractClient } from "@abstract-foundation/agw-react";

const checkIsContract = async (address: `0x${string}`): Promise<boolean> => {
  const code = await getBytecode(config, {
    address,
    chainId: abstract.id,
  });
  return code !== "0x" && code !== undefined;
};

const useAGW = (address: `0x${string}` | undefined) => {
  const [isAGW, setIsAGW] = useState(false);
  const { data: agwClient, isLoading, error } = useAbstractClient();

  useEffect(() => {
    let isMounted = true;
    async function check() {
      try {
        if (!address) return;
        const isContract = await checkIsContract(address);
        if (isMounted) {
          setIsAGW(isContract);
        }
      } catch (e) {
        console.log("error", e);
      }
    }
    if (address) {
      check();
    }
    return () => {
      isMounted = false;
    };
  }, [address]);

  return useMemo(
    () => ({
      isAGW,
      isLoading,
      error,
      client: agwClient,
      getGeneralPaymasterInput,
    }),
    [isAGW, isLoading, error, agwClient],
  );
};

export default useAGW;
