import CommentService from "../services/CommentService.js";

export const index = async (req, res, __) => {
  try {
    const commentService = await CommentService;
    const comments = await commentService.index(req.headers.cookie);

    res.json(comments);
  } catch (error) {
    console.error(error);
    res.json([]);
  }
};

export const create = async (req, res, __) => {
  try {
    const commentService = await CommentService;
    const comment = await commentService.create(req.body, req.headers.cookie);

    res.json(comment);
  } catch (error) {
    console.error(error);
    res.json({});
  }
};

export const like = async (req, res, __) => {
    try {
        const commentService = await CommentService;
        await commentService.like(req.body, req.params.id, req.headers.cookie);
    } catch (error) {
        console.error(error);
        res.json({});
    }
}

export const dislike = async (req, res, __) => {
    try {
        const commentService = await CommentService;
        await commentService.dislike(req.body, req.params.id, req.headers.cookie);
    } catch (error) {
        console.error(error);
        res.json({});
    }
}