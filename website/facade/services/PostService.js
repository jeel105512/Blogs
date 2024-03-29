import APIProvider from "../utilities/APIProvider.js";

const PostService = (async () => {
  const apiProvider = await APIProvider();

  return {
    index: async (cookies) => {
      try {
        const posts = await apiProvider.get("/posts/publicPosts", {
          headers: {
            Cookie: cookies,
          },
        });

        return posts.data?.posts || [];
      } catch (error) {
        throw error;
      }
    },
    show: async (id, cookies) => {
      try {
        const post = await apiProvider.get(`/posts/${id}`, {
          headers: {
            Cookie: cookies,
          },
        });

        return {
          post: post.data?.post,
          userId: post.data?.userId,
        } || {};
      } catch (error) {
        throw error;
      }
    },
  };
})();

export default PostService;
