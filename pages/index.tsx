// @ts-nocheck
import { useWallet } from "@solana/wallet-adapter-react";
import NavBar from "@/components/NavBar";
import Home from "@/containers/Home";
import { useState } from "react";
import Candies from "@/containers/Candies";

export default function Index() {
  const { connected } = useWallet();

  const [candyMachineData, setCandyMachineData] = useState<any>(null);

  return (
    <div className="bg-[#151515] min-h-screen">
      {/* <NavBar /> */}

      {candyMachineData ? (
        <Candies candyMachineData={candyMachineData} />
      ) : (
        <Home setCandyMachineData={setCandyMachineData} />
      )}
    </div>
  );
}
