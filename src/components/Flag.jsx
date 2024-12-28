function Flag({ url, name }) {
  return (
    <div className="flex flex-col gap-4">
      <img className="w-[77.49px] h-[53.5px]" src={url} alt={`${name} Flag`} />
      <p className="3xl:text-xl text-base font-medium text-customGray">
        {name}
      </p>
    </div>
  );
}

export default Flag;
