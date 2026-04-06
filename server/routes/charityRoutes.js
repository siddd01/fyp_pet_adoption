    import express from "express";
import { getAllCharityPosts } from "../controllers/charityController";

    const router = express.Router();

router.get('/charity-posts', getAllCharityPosts);
    

    export default router;


