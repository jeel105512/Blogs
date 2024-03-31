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
    update: async (id, comment, cookies) => {
      try {
        await apiProvider.put(`/comments/${id}`, comment, {
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
    destroy: async (id, cookies) => {
      try {
        await apiProvider.delete(`/comments/${id}`, {
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
