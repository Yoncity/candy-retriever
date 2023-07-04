import { useCallback, useRef } from "react";
import { Metaplex } from "@metaplex-foundation/js";
import { PublicKey } from "@solana/web3.js";
import { useConnection } from "@solana/wallet-adapter-react";
import { useEffect, useState } from "react";
import Button from "@/components/Button";

type Props = {
  setCandyMachineData: (data: any) => void;
};

export default function Home({ setCandyMachineData }: Props) {
  const [candyMachineAddress, setCandyMachineAddress] = useState("");
  const { connection } = useConnection();
  const metaplex = Metaplex.make(connection);

  const debounceRef = useRef<any>(null);

  const [fetchCandyMachineState, setFetchCandyMachineState] = useState({
    loading: false,
    error: null,
  });

  const [validFields, setValidFields] = useState({
    isValid: false,
    borderStyle: "border-zinc-300",
    errorInfo: "",
  });

  const handleChange = ({
    target: { value },
  }: {
    target: { value: string };
  }) => {
    setCandyMachineAddress(value);
    setValidFields({
      isValid: false,
      borderStyle: "border-zinc-300",
      errorInfo: "",
    });
  };

  const fetchCandyMachine = async () => {
    setFetchCandyMachineState({
      loading: true,
      error: null,
    });

    try {
      const candyMachine = await metaplex
        .candyMachinesV2()
        .findByAddress({ address: new PublicKey(candyMachineAddress) });

      if (candyMachine && Object.keys(candyMachine).length > 0) {
        console.log("🚀 - file: home.tsx:29 - candyMachine:", candyMachine);
        setCandyMachineData(candyMachine);
      } else {
        setFetchCandyMachineState({
          loading: false,
          error: "No Candies Found 😢",
        });
      }
    } catch (error) {
      setFetchCandyMachineState({
        loading: false,
        error: "No Candies Found 😢",
      });
    }
  };

  const isValidPublicKey = (address: string): boolean => {
    try {
      new PublicKey(address);
      return true;
    } catch (error) {
      return false;
    }
  };

  const validateField = useCallback((value) => {
    let borderStyle = "",
      errorInfo = "";

    const isValidAddress = isValidPublicKey(value);

    if (value.length === 0) borderStyle = `border-zinc-300`;
    else if (isValidAddress) borderStyle = `border-green-500`;
    else {
      borderStyle = `border-red-500`;
      errorInfo = "h-auto opacity-100";
    }

    setValidFields({
      isValid: isValidAddress,
      borderStyle,
      errorInfo,
    });
  }, []);

  const handleSubmit = () => {
    if (validFields.isValid) {
      fetchCandyMachine();
    }
  };

  useEffect(() => {
    debounceRef.current = setTimeout(() => {
      if (candyMachineAddress.length < 2) return;

      validateField(candyMachineAddress);
    }, 750);

    return () => clearTimeout(debounceRef.current);
  }, [candyMachineAddress, validateField]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[url('/assets/noise.png')] bg-[length:50%] gap-y-12">
      <p className="font-bold text-[72px] text-white">Candy Retriever</p>
      <div className="flex flex-col gap-y-2 items-center w-full">
        <div className="flex flex-col gap-y-6 min-w-[35%]">
          <label className="font-light text-[18px] text-center text-[#ddd]">
            Candy Machine Address
          </label>
          <input
            type="text"
            name="email"
            className={`border ${validFields.borderStyle} rounded-lg p-3 outline-[5px] outline-[#4568f580] text-base font-light bg-transparent text-white text-center`}
            placeholder="6jDBLDtCrQGSVW937WSiXe8VdC3Tz2U8XH25iqdg4m9E"
            onChange={handleChange}
          />
          <div
            className={`-mt-1 h-0 opacity-0 transition-all duration-300 ease-linear ${
              validFields.errorInfo ? `h-auto opacity-100` : ""
            }`}
          >
            <p className="text-red-500 text-center">Use valid address</p>
          </div>
        </div>

        <Button
          text="Find Candies"
          className={`justify-center mt-2 !text-base py-3 
            ${
              validFields.isValid
                ? ""
                : "!bg-[#EEEEEE] !border-[#EEEEEE] !text-[#B5B5B5] drop-shadow-none pointer-events-none"
            }
            ${fetchCandyMachineState.loading && "pointer-events-none"}
            `}
          onClick={handleSubmit}
          loader={fetchCandyMachineState.loading}
          icon
        />
        {fetchCandyMachineState.error && (
          <p className="text-red-500 text-input-error text-[24px] mt-6 animate-pulse">
            {fetchCandyMachineState.error}
          </p>
        )}
      </div>
    </div>
  );
}
