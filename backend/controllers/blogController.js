const mongoose = require("mongoose");

const blog = require("../models/blogModel");

const User = require("../models/userModel");

const Img = require("../models/imgModel");

const additionalFields = {
  $addFields: {
    likedByCount: { $size: { $ifNull: ["$likedby", []] } },
    dislikedByCount: { $size: { $ifNull: ["$dislikedby", []] } },
  },
};

const filterByPopularity = [
  additionalFields,
  {
    $project: {
      title: 1, // Field for direct display
      author: 1,
      category: 1,
      content: 1,
      likedby: 1,
      dislikedby: 1,
      likedByCount: 1, // Computed field
      dislikedByCount: 1, // Computed field
      image: 1,
      datePublished: 1,
      createdAt: 1,
      updatedAt: 1,
    },
  },
  {
    $sort: { likedByCount: -1 }, // Sort by likedByCount in descending order
  },
  {
    $limit: 10, // Limit to 10 documents
  },
  {
    $lookup: {
      from: "imgs",
      localField: "image",
      foreignField: "_id",
      as: "image",
    },
  },
  {
    $unwind: "$image",
  },
];

const getBlogs = async (req, res) => {
  try {
    const blogs = await blog.find().sort({ createdAt: -1 }).populate("image"); // Sort newest to oldest
    res.status(200).json(blogs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// const getUserBlogs = async (req, res) => {
//   const user_id = req.user._id;
//   const blogs = await blog.find({ user_id }).sort({ createdAt: -1 });
//   res.status(200).json(blogs);
// };

const getUserBlogs = async (req, res) => {
  const user_id = req.user._id;

  try {
    const user = await User.findById(user_id).populate({
      path: "userBlogs",
      populate: {
        path: "image",
        model: "Img",
      },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ userBlogs: user.userBlogs });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getPopularBlogs = async (req, res) => {
  try {
    const blogs = await blog.aggregate(filterByPopularity);

    res.status(200).json(blogs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// const getBlogByCategory = async (req, res) => {
//   const { category } = req.params;

//   const Blog = await blog.find({ category: category });
//   if (!Blog) {
//     return res.status(404).json({ error: "No such blog" });
//   }
//   return res.status(200).json(Blog);
// };

// const getBlogByTitle = async (req, res) => {
//   const { title } = req.params;

//   try {
//     const blogs = await blog.find({ title: { $regex: title, $options: "i" } });

//     if (blogs.length === 0) {
//       return res.status(404).json({ error: "No such blog" });
//     }

//     return res.status(200).json(blogs);
//   } catch (error) {
//     return res.status(500).json({ error: "Internal server error" });
//   }
// };

const getBlogsByFilter = async (req, res) => {
  const { category, title } = req.query;

  let searchCriteria = {};

  if (category) {
    searchCriteria.category = category;
  }

  if (title) {
    searchCriteria.title = { $regex: title, $options: "i" };
  }

  try {
    const blogs = await blog.find(searchCriteria).populate("image");

    // if (blogs.length === 0) {
    //   return res.status(404).json({ error: "No such blog" });
    // }

    return res.status(200).json(blogs);
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
};

const createBlog = async (req, res) => {
  const { title, category, content, image } = req.body;
  const user_id = req.user._id;

  const user = await User.findById(user_id);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const author = user.first_name.concat(" ", user.last_name);

  let newImg = new Img({
    image,
    uploadedBy: user_id,
  });

  newImg = await newImg.save();

  try {
    //Create the blog and add it to the blogs
    const Blog = await blog.create({
      title,
      author,
      category,
      content,
      image: newImg._id,
      user_id,
    });

    // Add the blog to the user's postedBlogs array

    user.userBlogs.push(Blog._id);
    await user.save();

    res.status(200).json(Blog);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deleteBlog = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "No such blog to delete" });
  }
  const Blog = await blog.findOneAndDelete({ _id: id });

  if (!Blog) {
    return res.status(404).json({ error: "No such blog" });
  } else {
    return res.status(200).json("Deleted Blog: " + Blog);
  }
};

const updateBlog = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json("No such blog to update");
  }
  const Blog = await blog.findOneAndUpdate({ _id: id }, req.body, {
    new: true,
  }); // the 'new' is to update the Blog directly when returning it instead of refreshing to get it updated

  if (!Blog) {
    return res.status(404).json({ error: "No such blog" });
  }

  return res.status(200).json(Blog);
};

const likedBlog = async (req, res) => {
  try {
    const userId = req.user._id;
    const blogId = req.body._id;

    if (!mongoose.Types.ObjectId.isValid(blogId)) {
      return res.status(400).json({ message: "Invalid blog ID" });
    }

    const existingBlog = await blog.findById(blogId);

    if (!existingBlog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    const alreadyLiked = existingBlog.likedby.some(
      (id) => id.toString() === userId.toString(),
    );

    let updatedBlog;

    if (alreadyLiked) {
      // Clicking again removes the like.
      updatedBlog = await blog
        .findByIdAndUpdate(
          blogId,
          {
            $pull: { likedby: userId },
          },
          { new: true },
        )
        .populate("image");
    } else {
      // Add like and remove any previous dislike.
      updatedBlog = await blog
        .findByIdAndUpdate(
          blogId,
          {
            $addToSet: { likedby: userId },
            $pull: { dislikedby: userId },
          },
          { new: true },
        )
        .populate("image");
    }

    return res.status(200).json({
      message: alreadyLiked ? "Like removed" : "Blog liked",
      blog: updatedBlog,
    });
  } catch (error) {
    console.error("Like error:", error);

    return res.status(500).json({
      message: "Could not update like",
      error: error.message,
    });
  }
};

const dislikedBlog = async (req, res) => {
  try {
    const userId = req.user._id;
    const blogId = req.body._id;

    if (!mongoose.Types.ObjectId.isValid(blogId)) {
      return res.status(400).json({ message: "Invalid blog ID" });
    }

    const existingBlog = await blog.findById(blogId);

    if (!existingBlog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    const alreadyDisliked = existingBlog.dislikedby.some(
      (id) => id.toString() === userId.toString(),
    );

    let updatedBlog;

    if (alreadyDisliked) {
      // Clicking again removes the dislike.
      updatedBlog = await blog
        .findByIdAndUpdate(
          blogId,
          {
            $pull: { dislikedby: userId },
          },
          { new: true },
        )
        .populate("image");
    } else {
      // Add dislike and remove any previous like.
      updatedBlog = await blog
        .findByIdAndUpdate(
          blogId,
          {
            $addToSet: { dislikedby: userId },
            $pull: { likedby: userId },
          },
          { new: true },
        )
        .populate("image");
    }

    return res.status(200).json({
      message: alreadyDisliked ? "Dislike removed" : "Blog disliked",
      blog: updatedBlog,
    });
  } catch (error) {
    console.error("Dislike error:", error);

    return res.status(500).json({
      message: "Could not update dislike",
      error: error.message,
    });
  }
};

module.exports = {
  getBlogs,
  getUserBlogs,
  getBlogsByFilter,
  getPopularBlogs,
  createBlog,
  deleteBlog,
  updateBlog,
  likedBlog,
  dislikedBlog,
};
