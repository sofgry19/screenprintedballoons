import { ExclamationTriangleIcon } from "@heroicons/react/16/solid";

export const ErrorModule = ({
  title,
  text,
  buttonText,
  onButtonClick,
}: {
  title: string;
  text: string;
  buttonText?: string;
  onButtonClick?: () => void;
}) => (
  <div
    className={`flex flex-col gap-y-2 w-full lg:3/4 mx-auto rounded-2xl p-2 bg-purple-800 text-sm md:text-lg text-white`}
  >
    <div className="flex flex-row justify-center items-center gap-x-2 w-full">
      <ExclamationTriangleIcon className="h-4 w-4 md:h-8 md:w-8" />
      <div className="md:text-2xl underline">{title}</div>
      <ExclamationTriangleIcon className="h-4 w-4 md:h-8 md:w-8" />
    </div>
    <div className="md:text-xl">{text}</div>
    {onButtonClick && (
      <button
        className="w-full rounded-lg p-2 bg-purple-200 hover:bg-purple-100 active:bg-purple-300 text-purple-800 transition-color duration-200 cursor-pointer"
        type="button"
        onClick={onButtonClick}
      >
        {buttonText}
      </button>
    )}
  </div>
);
