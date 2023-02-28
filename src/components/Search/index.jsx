import React from 'react';
import {Search} from "@antmjs/vantui";
import {Text} from "@tarojs/components";

function SearchBar(props) {
  const {placeholderData} = props
  const [value, setValue] = React.useState(placeholderData)

  function handleSearchBarChange(searchValue) {
    setValue(searchValue.detail)
  }

  const {getSearchKeyword} = props;


  return (
    <Search renderAction={<Text className='searchbar__action-text' onClick={() => {
      getSearchKeyword(value)
    }}
    >查询</Text>} placeholder={placeholderData} shape='round' onSearch={() => {
      getSearchKeyword(value)
    }} background='#eb4035' onChange={handleSearchBarChange}
    />
    // <AtSearchBar fixed value={value} onChange={handleSearchBarChange} actionName='查询'
    //   onActionClick={()=>{getSearchKeyword(value)}} onConfirm={()=>{getSearchKeyword(value)}}
    // />
  );
}

export default SearchBar;
