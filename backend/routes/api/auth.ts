import { Router } from "express";

import LogIn from "./Login";
import SignUp from "./Signup";
import LogOut from "./Logout";

import { GetOwnedBoards } from "./GetOwnedBoards";
import { GetParticipatingBoards } from "./GetParticipatingBoards";
import { CreateBoard } from "../../routes/api/CreateBoard";
import { BoardLookup } from "../../routes/api/BoardLookup";
import { doubleCsrfProtection, generateToken } from "src/Authentication";

import { Request, Response } from "express";
import { getAllBoards, getAllUsers } from "Database";

// Initialize the router
const router = Router();

// Initialize CSRF protection
router.use(doubleCsrfProtection);
console.log("\tCSRF protection initialized.");

// Generate CSRF tokens
router.get("/api/csrf", (req: Request, res) => {
	const csrf = generateToken(req, res);
	res.json({ csrf });
});
console.log("\tDouble CSRF authentication initialized.");

// TODO REMOVE THEM LATER
router.get("/api/users", (_req: Request, res: Response) => {
	res.json(getAllUsers());
});
router.get("/api/boards", (_req: Request, res: Response) => {
	res.json(getAllBoards());
});

// Initialize API routes
router.get("/api/bingo/:id", BoardLookup);

router.get("/api/getParticipatingBoards", GetParticipatingBoards);
router.get("/api/getOwnedBoards", GetOwnedBoards);

router.post("/api/createBoard", CreateBoard);

router.post("/api/login", LogIn);
router.post("/api/signup", SignUp);
router.post("/api/logout", LogOut);

console.log("\tInitialized authentication routes.");

export default router;