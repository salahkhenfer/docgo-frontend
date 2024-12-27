function DropDownContent({ links }) {
  const Style =
    "text-customGray font-medium  px-6 py-3  hover:bg-sky-50 lg:max-3xl:px-4 lg:max-3xl:py-2 md:max-lg:px-2 md:max-lg:py-1";
  return (
    <div className="flex flex-col text-lg  gap-4 rounded-xl bg-white border-[2px] border-solid border-gray-400 w-64 lg:max-3xl:text-base md:max-lg:text-[12px] lg:max-3xl:w-48 md:max-lg:w-44 ">
      {links.map((link, index) => {
        if (index === 0)
          return (
            <a
              key={link.text}
              className={`${Style} border-solid border-gray-400 rounded-t-lg`}
              href={link.href}
            >
              {link.text}
            </a>
          );
        else if (index === links.length - 1)
          return (
            <a
              key={link.text}
              className={`${Style} border-solid border-gray-400 rounded-b-lg`}
              href={link.href}
            >
              {link.text}
            </a>
          );
        else
          return (
            <a key={link.text} className={Style} href={link.href}>
              {link.text}
            </a>
          );
      })}
    </div>
  );
}

export default DropDownContent;
