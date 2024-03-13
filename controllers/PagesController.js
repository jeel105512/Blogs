export const home = async (_, res, next) => {
    try{
        res.render("pages/home", {
            title: "Home"
        });
    } catch (err) {
        err.status = 500;
        return next(err);
    }
} 