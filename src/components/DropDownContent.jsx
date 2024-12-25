function DropDownContent({ links }) {
  return (
    <div className="flex flex-col gap-4 bg-white rounded-md ">
      {links.map((link) => (
        <a
          key={link.href}
          className="text-customGray font-medium text-lg p-2 "
          href={link.href}
        >
          {link.text}
        </a>
      ))}
    </div>
  );
}

export default DropDownContent;
