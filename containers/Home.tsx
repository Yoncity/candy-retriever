// @ts-nocheck
import { Metaplex } from "@metaplex-foundation/js";
import { PublicKey } from "@solana/web3.js";
import { useConnection } from "@solana/wallet-adapter-react";
import { useEffect, useState } from "react";

type Props = {
  setCandyMachineData: (data: any) => void;
};

export default function Home({ setCandyMachineData }: Props) {
  const [candyMachineAddress, setCandyMachineAddress] = useState("");
  const { connection } = useConnection();
  const metaplex = Metaplex.make(connection);

  const handleChange = ({
    target: { value },
  }: {
    target: { value: string };
  }) => {
    setCandyMachineAddress(value);
  };

  const fetchCandyMachine = async () => {
    try {
      const candyMachine = await metaplex
        .candyMachinesV2()
        .findByAddress({ address: new PublicKey(candyMachineAddress) });
      console.log('🚀 - file: home.tsx:29 - candyMachine:', candyMachine);

      setCandyMachineData(candyMachine);
    } catch (e) {
      alert("Please submit a valid CMv2 address.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <p className="font-bold text-[72px] text-white">Candy Retriever</p>
      <div className="flex gap-x-2">
        <input
          className="py-2 px-4 outline-none"
          type="text"
          placeholder="Candy Machine Address"
          onChange={handleChange}
        />
        <button
          className="bg-white py-2 px-4 cursor-pointer"
          onClick={() => fetchCandyMachine()}
        >
          Check
        </button>
      </div>
    </div>
  );
}
