import clsx from "clsx";

import Image from "next/image";

type StatCardProps = {
  type: "appointments" | "pending" | "cancelled";
  label: string;
  count: number;
  icon: string;
};
export default function StatCard({
  count = 0,
  label,
  type,
  icon,
}: StatCardProps) {
  return (
    <div
      className={clsx("stat-card", {
        "bg-appointments": type === "appointments",
        "bg-pending": type === "pending",
        "bg-cancelled": type === "cancelled",
      })}
    >
      <div className="flex items-center gap-4">
        <Image
          src={icon}
          width={32}
          height={32}
          alt={label}
          className="size-8 w-fit"
        />
        <h2 className="text-32-bold text-white">{count}</h2>
      </div>
      <p className="text-14-regular">{label}</p>
    </div>
  );
}
