export const home = async (_, res, next) => {
  try {
    res.render("pages/home", {
      title: "Home",
      TINYMCE_KEY: process.env.TINYMCE_KEY,
    });
  } catch (err) {
    err.status = 500;
    return next(err);
  }
};
