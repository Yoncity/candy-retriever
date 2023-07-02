export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center">
      <p className="font-bold text-[72px] text-white">Candy Retriever</p>
      <div className="border border-white">
        <input
          className="text-white"
          type="text"
          placeholder="Candy Machine Address"
        />
      </div>
    </div>
  );
}
