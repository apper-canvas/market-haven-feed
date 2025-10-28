import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setSearchQuery } from "@/store/filtersSlice";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";

const SearchBar = ({ className = "" }) => {
  const [query, setQuery] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      dispatch(setSearchQuery(query.trim()));
      navigate("/search");
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`flex gap-2 ${className}`}>
      <div className="flex-1">
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search products..."
          className="rounded-r-none border-r-0"
        />
      </div>
      <Button 
        type="submit"
        icon="Search"
        className="rounded-l-none"
        disabled={!query.trim()}
      >
        Search
      </Button>
    </form>
  );
};

export default SearchBar;