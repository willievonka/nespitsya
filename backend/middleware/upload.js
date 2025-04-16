import multer from 'multer';
import path from 'path';

// Настройки хранилища
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'static/');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, file.fieldname + '-' + uniqueSuffix + ext);
    }
});

const upload = multer({ storage });

export default upload;
