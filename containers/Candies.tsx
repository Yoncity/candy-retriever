import { Metaplex, walletAdapterIdentity } from "@metaplex-foundation/js";
import { PublicKey } from "@solana/web3.js";
import { Metadata } from "@metaplex-foundation/mpl-token-metadata";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { useEffect, useState } from "react";
import async from "async";
import Image from "next/image";
import NavBar from "@/components/NavBar";
import Button from "@/components/Button";
import fetchMetadata from "@/helpers/fetchMetadata";

type Props = {
  candyMachineData: any;
};

export default function Candies({ candyMachineData }: Props) {
  const { connection } = useConnection();
  const wallet = useWallet();

  const metaplex = Metaplex.make(connection);

  const [collectionDetails, setCollectionDetails] =
    useState<Record<any, any>>(undefined);
  const [candyDetails, setCandyDetails] = useState<Array<any>>([]);

  const [mintNFTState, setMintNFTState] = useState({
    loading: false,
    error: null,
    success: "",
  });

  useEffect(() => {
    if (candyMachineData) {
      const fetchCollectionData = async () => {
        try {
          const metadataPda = metaplex
            .nfts()
            .pdas()
            .metadata({ mint: candyMachineData.collectionMintAddress });

          const {
            data: { name, uri, symbol },
          } = await Metadata.fromAccountAddress(connection, metadataPda);

          const data = await fetchMetadata(uri);

          setCollectionDetails({
            ...data,
            collectionName: name,
            collectionSymbol: symbol,
          });
        } catch (error) {
          console.error("🐞 - Something Went Wrong", error);
        }
      };

      fetchCollectionData();

      const fetchNFTData = async () => {
        let nftData = [];
        await async.eachOfSeries(
          candyMachineData.items,
          async ({
            name,
            uri,
          }: {
            name: string;
            uri: string;
          }): Promise<void> => {
            const data = await fetchMetadata(uri);

            nftData.push(data);
          }
        );
        setCandyDetails(nftData.reverse());
      };

      fetchNFTData();
    }
  }, [candyMachineData, connection, metaplex]);

  async function mintNft() {
    if (!wallet.connected) {
      alert("Please Connect Wallet");
      return;
    }

    setMintNFTState({
      loading: true,
      error: null,
      success: "",
    });
    try {
      const data = await metaplex
        .use(walletAdapterIdentity(wallet))
        .candyMachinesV2()
        .mint({
          candyMachine: candyMachineData,
        });

      setMintNFTState({
        loading: false,
        error: null,
        success: `Successfully Minted. https://explorer.solana.com/address/${data.nft.address}?cluster=devnet`,
      });
    } catch (error) {
      setMintNFTState({
        loading: false,
        error: error?.message || error,
        success: "",
      });
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-[url('/assets/noise.png')] bg-[length:50%]">
      <NavBar />
      <div className="h-[500px] relative flex flex-col">
        <div className="absolute w-full h-full top-0">
          {!!collectionDetails?.image && (
            <>
              <Image
                src={`${collectionDetails.image}`}
                alt="NFT Collection Image"
                className="object-contain z-[2]"
                fill
                priority
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
          <div className="flex items-center gap-x-12 ml-14 ">
            <p className="text-[36px]">{collectionDetails?.collectionName}</p>
            <p className="font-extralight text-[36px] before:w-[8px] relative before:h-[8px] before:absolute before:rounded-full before:bg-white before:top-[calc(50%-4px)] before:left-[calc(-24px)]">
              {collectionDetails?.symbol || candyMachineData.symbol}
            </p>
          </div>
          <p className="font-extralight text-[24px] mr-14">
            <b>{candyDetails.length}</b>{" "}
            <span className="font-thin italic">{`nft's`}</span>
          </p>
        </div>
      </div>

      <div className="flex flex-col m-14 gap-y-16">
        <div className="flex flex-col items-center justify-center">
          <Button
            onClick={() => mintNft()}
            text={"MINT"}
            loader={mintNFTState.loading}
            className={`${mintNFTState.loading && "pointer-events-none"}`}
          />

          {!!mintNFTState.success && (
            <div
              className={`mt-6 h-0 opacity-0 transition-all duration-300 ease-linear animate-pulse
              ${mintNFTState.success ? `h-auto opacity-100` : ""}
              `}
            >
              <p className="text-green-600 text-center">
                {mintNFTState.success}
              </p>
            </div>
          )}

          {!!mintNFTState.error && (
            <div
              className={`mt-6 h-0 opacity-0 transition-all duration-300 ease-linear ${
                mintNFTState.error ? `h-auto opacity-100` : ""
              }`}
            >
              <p className="text-red-500 text-center">{mintNFTState.error}</p>
            </div>
          )}
        </div>

        {candyDetails.map((candies: any, index) => (
          <div className="flex" key={`index_${index}_${candies.name}`}>
            <div className="relative w-[300px] h-[300px] overflow-hidden bg-transparent">
              <Image
                src={`${candies.image}`}
                alt="NFT image"
                className="object-contain border border-[#222] bg-[#00000062] hover:rounded-lg hover:cursor-pointer hover:scale-[1.3] transition-all duration-[0.2s] ease-out z-[2]"
                fill
                priority
              />
              <Image
                src={`${candies.image}`}
                alt="NFT image"
                className="object-cover border-4 border-[#222] blur-[20px] rounded-lg"
                fill
              />
            </div>

            <div className="flex flex-col text-white flex-1 p-8 truncate gap-y-2">
              <p className="text-[32px]">{candies.name}</p>
              <p className="text-[20px] font-light truncate">
                {candies.description}
              </p>

              <div className="flex flex-col">
                <p className="text-[18px] mt-4">Attributes</p>
                <div className="flex flex-col py-4 px-6 gap-y-4">
                  {candies?.attributes?.map((attribute, index2) => (
                    <div
                      className="flex justify-between"
                      key={`${index2}_${attribute.trait_type}_${attribute.value}`}
                    >
                      <p className="text-[15px] italic font-light">
                        {attribute.trait_type}
                      </p>
                      <p className="text-[15px]">{attribute.value}</p>
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
