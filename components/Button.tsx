import { HiArrowRight } from "react-icons/hi";

type Props = {
  text: String;
  icon?: boolean;
  onClick: () => void;
  className?: String;
  loader?: boolean;
};
export default function Button({
  text,
  icon,
  onClick,
  className,
  loader,
}: Props) {
  return (
    <button
      onClick={onClick}
      className={`group ${className} flex items-center py-2 px-9 gap-x-[9px] border-[1px] text-base-s transition-all duration-200 ease-linear bg-[#f44336] border-[#f44336] text-white hover:bg-white hover:text-[#f44336] rounded-lg active:scale-[0.95]`}
    >
      {loader && (
        <div className="w-4 h-4 bg-transparent rounded-full border-2 border-transparent border-t-white animate-spin group-hover:border-t-[#f44336]"></div>
      )}
      {text}
      {icon && (
        <HiArrowRight
          size={18}
          className="group-hover:translate-x-[3px] transition-all duration-200 ease-linear"
        />
      )}
    </button>
  );
}
