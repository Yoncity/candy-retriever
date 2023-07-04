import WalletMultiButtonDynamic from "./WalletMultiButtonDynamic";
import { HiArrowLeft } from "react-icons/hi";

const NavBar = () => {
  return (
    <div className="absolute text-white text-[18px] flex justify-between items-center px-14 mt-8 flex-1 rounded-full bg-transparent z-[3] w-full">
      <div className="flex items-center justify-center gap-x-6 bg-[#ffffff25] rounded-full py-2 px-4">
        <div className="bg-[#ffffff25] rounded-full p-2 cursor-pointer hover:bg-[#ffffff0f] active:scale-[0.95] transition-all duration-200 ease-linear animate-pulse">
          <HiArrowLeft size={16} />
        </div>
        <p className="text-[24px]">Candy Retriever</p>
      </div>
      <div className="bg-[#ffffff25] rounded-lg">
        <WalletMultiButtonDynamic />
      </div>
    </div>
  );
};

export default NavBar;
