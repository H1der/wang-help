import React from 'react';
import {SearchBar} from "@nutui/nutui-react-taro";

function Search(props) {
  const [value, setValue] = React.useState('')

  function handleSearchBarChange(searchValue) {
    setValue(searchValue)
  }
  const { getSearchKeyword } = props;


  return (
    <SearchBar  actionText='查询' shape='round' onSearch={()=>{getSearchKeyword(value)}} background='#eb4035' onChange={handleSearchBarChange} />
    // <AtSearchBar fixed value={value} onChange={handleSearchBarChange} actionName='查询'
    //   onActionClick={()=>{getSearchKeyword(value)}} onConfirm={()=>{getSearchKeyword(value)}}
    // />
  );
}

export default Search;
