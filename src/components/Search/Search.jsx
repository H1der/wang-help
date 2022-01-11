import React from 'react';
import {AtSearchBar} from "taro-ui";

function Search(props) {
  const [value, setValue] = React.useState('')

  function handleSearchBarChange(searchValue) {
    setValue(searchValue)
  }
  const { getSearchKeyword } = props;



  return (
    <AtSearchBar fixed value={value} onChange={handleSearchBarChange} actionName='查询' onActionClick={()=>{getSearchKeyword(value)}} />
  );
}

export default Search;
