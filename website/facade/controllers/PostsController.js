import PostService from "../services/PostService.js";

export const index = async (req, res, _) => {
    try {
        const postService = await PostService;
        const posts = await postService.index(req.headers.cookie);

        res.json(posts);
    } catch (error) {
        console.error(error);
        res.json([]);
    }
};

export const show = async (req, res, _) => {
    try {        
        const postService = await PostService;
        const post = await postService.show(req.params.id, req.headers.cookie);
        res.json(post);
    } catch (error) {
        console.error(error);
        res.json({});
    }
};