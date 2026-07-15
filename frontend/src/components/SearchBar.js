import React from "react";
import { LatestBlogsContext } from "../context/LatestBlogsContext";
import axios from "axios";

export default function SearchBar() {
  const [categories, setCategories] = React.useState([]);
  const [search, setSearch] = React.useState("");
  const [category, setCategory] = React.useState("");
  const { dispatch: blogsDispatch } = React.useContext(LatestBlogsContext);

  React.useEffect(() => {
    const fetchLatest = async () => {
      try {
        const response = await axios.get("/blogs/filtered", {
          params: { category, title: search },
        });
        blogsDispatch({ type: "SET_BLOGS", blogs: response.data });
      } catch (error) {
        console.log(error);
      }
    };

    fetchLatest();
  }, [category, search, blogsDispatch]);

  React.useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("/categories/");
        setCategories(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchCategories();
  }, []);

  const clearFilters = () => {
    setSearch("");
    setCategory("");
  };

  return (
    <div className="search-panel">
      <div className="search-field">
        <span className="material-symbols-rounded">search</span>
        <input
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search by story title"
          aria-label="Search stories"
        />
      </div>

      <div className="filter-field">
        <span className="material-symbols-rounded">tune</span>
        <select
          value={category}
          onChange={(event) => setCategory(event.target.value)}
          aria-label="Filter by category"
        >
          <option value="">All categories</option>
          {categories.map((item) => (
            <option key={item._id || item.id || item.name} value={item.name}>{item.name}</option>
          ))}
        </select>
      </div>

      {(search || category) && (
        <button type="button" className="clear-filter" onClick={clearFilters}>
          <span className="material-symbols-rounded">close</span>
          Clear
        </button>
      )}
    </div>
  );
}
