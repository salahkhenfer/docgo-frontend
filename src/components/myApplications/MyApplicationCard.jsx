import { StatusBadge } from "./StatusBadge";

const backgroundStyles = {
  rejected: "bg-rose-100",
  accepted: "bg-green-100",
  pending: "bg-orange-100",
};

export const MyApplicationCard = ({ program, status }) => {
  return (
    <article
      className={`flex flex-wrap gap-8 items-center px-5 py-5 w-full ${backgroundStyles[status]} border border-solid rounded-[56px] max-md:px-5 max-md:max-w-full`}
    >
      <img
        src={program.imageUrl}
        alt={program.title}
        className="object-contain shrink-0 self-stretch my-auto aspect-[1.22] min-w-60 rounded-[40px] w-[100px]"
      />
      <div className="flex  flex-1 shrink gap-10 justify-between items-center self-stretch my-auto basis-0 min-w-60 max-md:max-w-full">
        <div className="self-stretch my-auto min-w-60 text-zinc-800 w-[637px] max-md:max-w-full">
          <h2 className="text-2xl font-semibold max-md:max-w-full">
            {program.title}
          </h2>
          <p className="mt-3 text-base leading-7 max-md:max-w-full">
            <strong className="underline">Description :</strong>{" "}
            {program.description}
          </p>
        </div>
        <StatusBadge status={status} />
      </div>
    </article>
  );
};
