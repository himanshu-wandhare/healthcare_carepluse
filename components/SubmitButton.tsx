import Image from "next/image";
import { Button } from "./ui/button";

type SubmitButtonProps = {
  isLoading: boolean;
  className?: string;
  children: React.ReactNode;
};

export default function SubmitButton({
  isLoading,
  className,
  children,
}: SubmitButtonProps) {
  return (
    <Button type="submit" className={className ?? "shad-primary-btn w-full"}>
      {isLoading ? (
        <div className="flex items-center gap-4">
          <Image
            src="/assets/icons/loader.svg"
            alt="loader"
            width={24}
            height={24}
          />
          Loading...
        </div>
      ) : (
        children
      )}
    </Button>
  );
}
