import { Router } from "express";
import Contact from "../models/contact.model";

const router = Router();

// Create query
router.post("/", async (req, res) => {
    const contact = await Contact.create(req.body);
    res.json(contact);
});

// All queries
router.get("/", async (_, res) => {
    const all = await Contact.find();
    res.json(all);
});

export default router;
