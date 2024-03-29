import APIProvider from "../utilities/APIProvider.js";

const CommentService = (async () => {
  const apiProvider = await APIProvider();

  return {
    index: async (cookies) => {
      try {
        const comments = await apiProvider.get("/comments", {
          headers: {
            Cookie: cookies,
          },
        });

        return comments.data?.comments || [];
      } catch (error) {
        throw error;
      }
    },
    create: async (comment, cookies) => {
      try {
        await apiProvider.post("/comments", comment, {
          headers: {
            Cookie: cookies,
          },
        });
      } catch (error) {
        throw error;
      }
    },
    like: async (comment, id, cookies) => {
      try {
        await apiProvider.post(`/comments/${id}/likeComment`, comment, {
          headers: {
            Cookie: cookies,
          },
        });
      } catch (error) {
        throw error;
      }
    },
    dislike: async (comment, id, cookies) => {
      try {
        await apiProvider.post(`/comments/${id}/dislikeComment`, comment, {
          headers: {
            Cookie: cookies,
          },
        });
      } catch (error) {
        throw error;
      }
    },
  };
})();

export default CommentService;
