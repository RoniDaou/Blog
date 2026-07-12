import { API_URL } from "../config";
import HomeBlogs from "../components/HomeBlogs";
import RevealOnScroll from "../components/RevealOnScroll";
import { LoadingContext } from "../context/LoadingContext";
import React from "react";
import { LatestBlogsContext } from "../context/LatestBlogsContext";
import { PopularBlogsContext } from "../context/PopularBlogsContext";

export default function Home({ setDisplayFooter }) {
  const { dispatch } = React.useContext(LoadingContext);
  const { latestBlogs, dispatch: latestBlogsDispatch } =
    React.useContext(LatestBlogsContext);
  const { popularBlogs, dispatch: popularBlogsDispatch } =
    React.useContext(PopularBlogsContext);

  React.useEffect(() => {
    setDisplayFooter(true);
  }, []);

  // Fetch latest blogs
  const fetchLatest = async () => {
    try {
      dispatch({ type: "LOAD" });
      const res = await fetch(`${API_URL}/blogs`);
      const data = await res.json();

      if (res.ok) {
        latestBlogsDispatch({ type: "SET_BLOGS", blogs: data });
        dispatch({ type: "STOP_LOAD" });
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Fetch popular blogs
  const fetchPopular = async () => {
    try {
      dispatch({ type: "LOAD" });
      const res = await fetch(`${API_URL}/blogs/popularBlogs`);
      const data = await res.json();

      if (res.ok) {
        popularBlogsDispatch({ type: "SET_BLOGS", blogs: data });
        dispatch({ type: "STOP_LOAD" });
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Fetch the needed data
  React.useEffect(() => {
    fetchLatest();
    fetchPopular();
  }, []);

  return (
    <div className="home--container">
      <RevealOnScroll>
        <HomeBlogs title="Latest Blogs" blogs={latestBlogs} />
      </RevealOnScroll>

      <RevealOnScroll>
        <HomeBlogs title="Popular Blogs" blogs={popularBlogs} />
      </RevealOnScroll>
    </div>
  );
}
