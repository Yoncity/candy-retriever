import { useWallet } from "@solana/wallet-adapter-react";
import NavBar from "@/components/NavBar";
import Home from "@/containers/Home";

export default function Index() {
  const { connected } = useWallet();

  return (
    <div className="bg-black min-h-screen">
      {/* <NavBar /> */}

      <Home />
    </div>
  );
}
