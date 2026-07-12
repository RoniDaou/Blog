const mongoose = require("mongoose");

const Blog = require("../models/blogModel");
const User = require("../models/userModel");
const Img = require("../models/imgModel");

const additionalFields = {
  $addFields: {
    likedByCount: {
      $size: {
        $ifNull: ["$likedby", []],
      },
    },
    dislikedByCount: {
      $size: {
        $ifNull: ["$dislikedby", []],
      },
    },
  },
};

const filterByPopularity = [
  additionalFields,
  {
    $project: {
      title: 1,
      author: 1,
      category: 1,
      content: 1,
      likedby: 1,
      dislikedby: 1,
      likedByCount: 1,
      dislikedByCount: 1,
      image: 1,
      datePublished: 1,
      createdAt: 1,
      updatedAt: 1,
    },
  },
  {
    $sort: {
      likedByCount: -1,
    },
  },
  {
    $limit: 10,
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
    $unwind: {
      path: "$image",
      preserveNullAndEmptyArrays: true,
    },
  },
];

/* Get all blogs */

const getBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 }).populate("image");

    return res.status(200).json(blogs);
  } catch (error) {
    console.error("Get blogs error:", error);

    return res.status(500).json({
      message: error.message,
    });
  }
};

/* Get blogs belonging to logged-in user */

const getUserBlogs = async (req, res) => {
  try {
    const userId = req.user._id;

    const user = await User.findById(userId).populate({
      path: "userBlogs",
      populate: {
        path: "image",
        model: "Img",
      },
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.status(200).json({
      userBlogs: user.userBlogs,
    });
  } catch (error) {
    console.error("Get user blogs error:", error);

    return res.status(500).json({
      message: error.message,
    });
  }
};

/* Get popular blogs */

const getPopularBlogs = async (req, res) => {
  try {
    const blogs = await Blog.aggregate(filterByPopularity);

    return res.status(200).json(blogs);
  } catch (error) {
    console.error("Get popular blogs error:", error);

    return res.status(500).json({
      message: error.message,
    });
  }
};

/* Filter blogs */

const getBlogsByFilter = async (req, res) => {
  try {
    const { category, title } = req.query;

    const searchCriteria = {};

    if (category) {
      searchCriteria.category = category;
    }

    if (title) {
      searchCriteria.title = {
        $regex: title,
        $options: "i",
      };
    }

    const blogs = await Blog.find(searchCriteria)
      .sort({ createdAt: -1 })
      .populate("image");

    return res.status(200).json(blogs);
  } catch (error) {
    console.error("Filter blogs error:", error);

    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

/* Create blog */

const createBlog = async (req, res) => {
  try {
    const { title, category, content, image } = req.body;
    const userId = req.user._id;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const author = `${user.first_name} ${user.last_name}`;

    const newImage = await Img.create({
      image,
      uploadedBy: userId,
    });

    const newBlog = await Blog.create({
      title,
      author,
      category,
      content,
      image: newImage._id,
      user_id: userId.toString(),
      likedby: [],
      dislikedby: [],
    });

    user.userBlogs.push(newBlog._id);
    await user.save();

    const populatedBlog = await Blog.findById(newBlog._id).populate("image");

    return res.status(201).json(populatedBlog);
  } catch (error) {
    console.error("Create blog error:", error);

    return res.status(400).json({
      error: error.message,
    });
  }
};

/* Delete blog */

const deleteBlog = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        error: "Invalid blog ID",
      });
    }

    const deletedBlog = await Blog.findByIdAndDelete(id);

    if (!deletedBlog) {
      return res.status(404).json({
        error: "No such blog",
      });
    }

    return res.status(200).json({
      message: "Blog deleted successfully",
      blog: deletedBlog,
    });
  } catch (error) {
    console.error("Delete blog error:", error);

    return res.status(500).json({
      message: error.message,
    });
  }
};

/* Update blog */

const updateBlog = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        error: "Invalid blog ID",
      });
    }

    const updatedBlog = await Blog.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    }).populate("image");

    if (!updatedBlog) {
      return res.status(404).json({
        error: "No such blog",
      });
    }

    return res.status(200).json(updatedBlog);
  } catch (error) {
    console.error("Update blog error:", error);

    return res.status(500).json({
      message: error.message,
    });
  }
};

/* Like or remove like */

const likedBlog = async (req, res) => {
  try {
    const blogId = req.body._id;
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({
        message: "User is not authenticated",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(blogId)) {
      return res.status(400).json({
        message: "Invalid blog ID",
      });
    }

    const existingBlog = await Blog.findById(blogId);

    if (!existingBlog) {
      return res.status(404).json({
        message: "Blog not found",
      });
    }

    const alreadyLiked = existingBlog.likedby.some(
      (id) => id.toString() === userId.toString(),
    );

    let updatedBlog;

    if (alreadyLiked) {
      updatedBlog = await Blog.findByIdAndUpdate(
        blogId,
        {
          $pull: {
            likedby: userId,
          },
        },
        {
          new: true,
          runValidators: true,
        },
      ).populate("image");
    } else {
      updatedBlog = await Blog.findByIdAndUpdate(
        blogId,
        {
          $addToSet: {
            likedby: userId,
          },
          $pull: {
            dislikedby: userId,
          },
        },
        {
          new: true,
          runValidators: true,
        },
      ).populate("image");
    }

    /*
     * Read the blog again from MongoDB to confirm that the
     * updated arrays were actually persisted.
     */
    const savedBlog = await Blog.findById(blogId).populate("image");

    console.log("LIKE SAVED:", {
      blogId: savedBlog._id.toString(),
      likedby: savedBlog.likedby.map((id) => id.toString()),
      dislikedby: savedBlog.dislikedby.map((id) => id.toString()),
    });

    return res.status(200).json({
      message: alreadyLiked ? "Like removed" : "Blog liked successfully",
      blog: savedBlog,
    });
  } catch (error) {
    console.error("Like error:", error);

    return res.status(500).json({
      message: "Could not update like",
      error: error.message,
    });
  }
};

/* Dislike or remove dislike */

const dislikedBlog = async (req, res) => {
  try {
    const blogId = req.body._id;
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({
        message: "User is not authenticated",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(blogId)) {
      return res.status(400).json({
        message: "Invalid blog ID",
      });
    }

    const existingBlog = await Blog.findById(blogId);

    if (!existingBlog) {
      return res.status(404).json({
        message: "Blog not found",
      });
    }

    const alreadyDisliked = existingBlog.dislikedby.some(
      (id) => id.toString() === userId.toString(),
    );

    let updatedBlog;

    if (alreadyDisliked) {
      updatedBlog = await Blog.findByIdAndUpdate(
        blogId,
        {
          $pull: {
            dislikedby: userId,
          },
        },
        {
          new: true,
          runValidators: true,
        },
      ).populate("image");
    } else {
      updatedBlog = await Blog.findByIdAndUpdate(
        blogId,
        {
          $addToSet: {
            dislikedby: userId,
          },
          $pull: {
            likedby: userId,
          },
        },
        {
          new: true,
          runValidators: true,
        },
      ).populate("image");
    }

    /*
     * Read the blog again from MongoDB to confirm that the
     * updated arrays were actually persisted.
     */
    const savedBlog = await Blog.findById(blogId).populate("image");

    console.log("DISLIKE SAVED:", {
      blogId: savedBlog._id.toString(),
      likedby: savedBlog.likedby.map((id) => id.toString()),
      dislikedby: savedBlog.dislikedby.map((id) => id.toString()),
    });

    return res.status(200).json({
      message: alreadyDisliked
        ? "Dislike removed"
        : "Blog disliked successfully",
      blog: savedBlog,
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
