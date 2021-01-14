const express = require("express");
const { createUser, login, deleteAccount, modifieUser } = require("../controllers/user");

const router = express.Router();

router
    .route('/createuser')
    .post(createUser);

router
    .route('/login')
    .post(login);

router
    .route('/deleteaccount')
    .delete(deleteAccount);

router
    .route('/modifieaccount')
    .put(modifieUser);

module.exports = router;