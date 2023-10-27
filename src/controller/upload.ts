import multer from "multer";

export const upload = multer({
    storage: multer.diskStorage({
        destination: "assets/uploads/",
        filename: function (req, file, cb) {
            cb(null, Date.now() + '.jpg') //Appending .jpg
        }
    })
});
