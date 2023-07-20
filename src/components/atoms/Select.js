import Select from 'react-select';

const SelectInput = ({
  width,
  placeholder,
  selectedValue,
  setSelectedValue,
  options,
  ...rest
}) => {

  return (
    <div className='flex flex-col w-full pb-2'>
      <span className='mb-2 font-semibold'>{placeholder}</span>
      <Select
        className="basic-single"
        classNamePrefix="select"
        value={selectedValue}
        onChange={(value) => setSelectedValue(value)}
        options={options}
      />
    </div>
  );
};

export default SelectInput;
