import React from "react";
import { LoadingContext } from "../context/LoadingContext";
import Loader from "../components/Loader";
import SearchBar from "../components/SearchBar";
import BlogBoxAll from "../components/BlogBoxAll";
import { LatestBlogsContext } from "../context/LatestBlogsContext";
import { API_URL } from "../config";
export default function AllBlogs({ setDisplayFooter }) {
  const { dispatch } = React.useContext(LoadingContext);
  const { latestBlogs, dispatch: blogsDispatch } =
    React.useContext(LatestBlogsContext);
  const [blogsElement, setBlogsElement] = React.useState([]);

  React.useEffect(() => {
    setDisplayFooter(true);
  }, []);

  // Fetch latest blogs
  const fetchLatest = async () => {
    try {
      dispatch({ type: "LOAD" });
      const res = await fetch(`${API_URL}/blogs/`);
      const data = await res.json();

      if (res.ok) {
        blogsDispatch({ type: "SET_BLOGS", blogs: data });
        dispatch({ type: "STOP_LOAD" });
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Fetch the needed data
  React.useEffect(() => {
    fetchLatest();
  }, []);

  // Create the blogs elements to be rendered
  React.useEffect(() => {
    setBlogsElement(
      latestBlogs.map((blog) => {
        return <BlogBoxAll blog={blog} />;
      }),
    );
  }, [latestBlogs]);

  return (
    <div className="all-blogs--container">
      <SearchBar />
      <div className="all-blogs">
        {blogsElement.length === 0 ? (
          <p className="no-blogs-p">No blogs matches your search.</p>
        ) : (
          blogsElement
        )}
      </div>
    </div>
  );
}
