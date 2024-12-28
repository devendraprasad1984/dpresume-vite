import React, { useEffect, useRef, useState } from "react";

const SearchExpensesGrid = (props) => {
  const { row, setSearchText, searchText } = props;
  const searchInputRef = useRef(null);
  const [searchInput, setSearchInput] = useState(searchText);

  const handleSearch = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setSearchText(searchInput);
  };

  const handleSearchTextChange = (e) => {
    setSearchInput(e.target.value);
  };
  const handleSearchOnKeyEnter = (e) => {
    if (e.keyCode === 13) {
      e.preventDefault();
      e.stopPropagation();
      setSearchText(e.target.value);
    }
  };
  useEffect(() => {
    searchInputRef.current.focus();
  }, []);

  return (
    <>
      <div className="row">
        <input
          ref={searchInputRef}
          placeholder={"Search expenses..."}
          value={searchInput}
          onChange={(e) => handleSearchTextChange(e)}
          onKeyDown={(e) => handleSearchOnKeyEnter(e)}
        />
        <button onClick={(e) => handleSearch(e)}>Search</button>
      </div>
    </>
  );
};

export default SearchExpensesGrid;
