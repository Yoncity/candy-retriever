import { Metaplex, walletAdapterIdentity } from "@metaplex-foundation/js";
import { PublicKey } from "@solana/web3.js";
import { Metadata } from "@metaplex-foundation/mpl-token-metadata";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { useEffect, useState } from "react";
import async from "async";
import Image from "next/image";
import NavBar from "@/components/NavBar";

type Props = {
  candyMachineData: any;
};

export default function Candies({ candyMachineData }: Props) {
  const { connection } = useConnection();
  const wallet = useWallet();

  const metaplex = Metaplex.make(connection);

  const [collectionDetails, setCollectionDetails] = useState<Record<any, any>>(
    {}
  );
  const [candyDetails, setCandyDetails] = useState<Array<any>>([]);

  useEffect(() => {
    if (candyMachineData) {
      const fetchCollectionData = async () => {
        const metadataPda = metaplex
          .nfts()
          .pdas()
          .metadata({ mint: candyMachineData.collectionMintAddress });

        const {
          mint,
          data: { uri },
        } = await Metadata.fromAccountAddress(connection, metadataPda);

        const fetchResult = await fetch(uri);
        const json = await fetchResult.json();
        setCollectionDetails(json);
      };

      fetchCollectionData();

      const fetchNFTData = async () => {
        let nftData = [];
        await async.eachOfSeries(
          candyMachineData.items,
          async (
            nft: { name: string; uri: string },
            index: number | string,
            callback: any
          ): Promise<void> => {
            const fetchResult = await fetch(nft.uri);
            const json = await fetchResult.json();

            nftData.push(json);
          }
        );
        setCandyDetails(nftData);
      };

      fetchNFTData();
    }
  }, [candyMachineData]);

  async function mintNft() {
    if (!wallet.connected) {
      alert("Please Connect Wallet");
      return;
    }

    const data = await metaplex
      .use(walletAdapterIdentity(wallet))
      .candyMachinesV2()
      .mint({
        candyMachine: candyMachineData,
      });

    console.log(
      `   Minted NFT: https://explorer.solana.com/address/${data.nft.address}?cluster=devnet`
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex justify-between z-[99]">
        <NavBar />
        <button className="button primary" onClick={() => mintNft()}>
          MINT
        </button>
      </div>
      <div className="h-[600px] relative flex flex-col">
        <div className="absolute w-full h-full">
          {!!collectionDetails.image && (
            <>
              <Image
                src={`${collectionDetails.image}`}
                alt="NFT Collection Image"
                className="object-contain z-[2]"
                fill
              />
              <Image
                src={`${collectionDetails.image}`}
                alt="NFT Collection Image"
                className="blur-[20px] z-[1]"
                fill
              />
            </>
          )}

          <div className="absolute bg-[#000000a0] w-full h-full left-0 top-0 z-[2]"></div>
        </div>

        <div className="flex m-auto mb-[24px] w-full items-center justify-between text-white z-[3]">
          <div className="flex items-center gap-x-12 ml-14">
            <p className="text-[48px]">Collection Name</p>
            <p className="font-extralight text-[48px] before:w-[8px] relative before:h-[8px] before:absolute before:rounded-full before:bg-white before:top-[calc(50%-4px)] before:left-[calc(-24px)]">
              {candyMachineData.symbol}
            </p>
          </div>
          <p className="font-extralight text-[48px] mr-14">4 {"NFT'S"}</p>
        </div>
      </div>
      <div className="flex flex-col m-14 gap-y-16">
        {candyDetails.map((candies: any, index) => (
          <div className="flex" key={`index_${index}_${candies.name}`}>
            <div className="relative w-[400px] h-[400px] overflow-hidden bg-transparent">
              <Image
                src={`${candies.image}`}
                alt="NFT image"
                className="object-contain border border-[#222] rounded-lg hover:rounded-lg hover:cursor-pointer hover:scale-[1.3] transition-all duration-[0.2s] ease-out z-[2]"
                fill
              />
              <Image
                src={`${candies.image}`}
                alt="NFT image"
                className="object-cover blur-[20px] border border-[#222] rounded-lg"
                fill
              />
            </div>

            <div className="flex flex-col text-white flex-1 p-8 truncate">
              <p className="text-[32px]">NFT name</p>
              <p className="text-[20px] font-light truncate">
                NFT description will come here and nwill span multiple lines at
                best. here is more line and we shall see how it will interpret
                it
              </p>

              <div className="flex flex-col">
                <p className="text-[20px] mt-4">Attributes</p>
                <div className="flex flex-col py-4 px-6 gap-y-4">
                  {candies.attributes.map((attribute, index2) => (
                    <div
                      className="flex justify-between"
                      key={`${index2}_${attribute.trait_type}_${attribute.value}`}
                    >
                      <p className="text-[16px] italic font-light">
                        {attribute.trait_type}
                      </p>
                      <p className="text-[16px]">{attribute.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
