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
        // theme={(theme) => ({
        //   ...theme,
        //   colors: {
        //     neutral0: '#fff',
        //     neutral20: '#CED8E2',
        //     neutral30: '#393939',
        //     neutral40: '#393939',
        //     neutral50: '#9CA6BE',
        //     neutral60: '#393939',
        //     neutral70: '#494949',
        //     neutral80: '#393939',
        //     neutral90: '#333'
        //   }
        //   }
        // )}
      />
    </div>
  );
};

export default SelectInput;
