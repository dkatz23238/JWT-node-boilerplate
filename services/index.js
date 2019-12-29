const createBlogpost = async (user, content) => {
  try {
    return await blogpostDb(user, content);
  } catch (e) {
    throw new Error(e.message);
  }
};

module.exports = {
  createBlogpost
};
