"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.create = exports.refresh = exports.validateAccessToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const SECRET_KEY = process.env.SECRET_KEY;
const ERROR_MESSAGES = {
    INVALID_TOKEN: "Invalid token",
    INVALID_TOKEN_PAYLOAD: "Invalid token payload",
    TOKEN_EXPIRED: "Token has expired",
    REFRESH_ERROR: "Error refreshing token",
};
const validateAccessToken = (req, res, next) => {
    const token = req.cookies.accessToken;
    if (!token) {
        console.warn(ERROR_MESSAGES.INVALID_TOKEN);
        return res.redirect("http://localhost:5173/");
    }
    try {
        const decodedToken = jsonwebtoken_1.default.decode(token);
        if (!isValidTokenPayload(decodedToken)) {
            console.warn(ERROR_MESSAGES.INVALID_TOKEN_PAYLOAD);
            return res.status(422).send(ERROR_MESSAGES.INVALID_TOKEN_PAYLOAD);
        }
        if (isTokenExpired(decodedToken)) {
            console.warn(ERROR_MESSAGES.TOKEN_EXPIRED);
            return res
                .status(422)
                .send(ERROR_MESSAGES.TOKEN_EXPIRED)
                .redirect("http://localhost:5173/login");
        }
        next();
    }
    catch (error) {
        console.warn(ERROR_MESSAGES.INVALID_TOKEN);
        return res.redirect("http://localhost:5173/login");
    }
};
exports.validateAccessToken = validateAccessToken;
function refresh(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const oldToken = req.cookies.accessToken;
        const user = req.user;
        if (!oldToken || !user) {
            console.warn(ERROR_MESSAGES.INVALID_TOKEN);
            return res.status(401).json({ message: ERROR_MESSAGES.INVALID_TOKEN });
        }
        try {
            const decodedToken = jsonwebtoken_1.default.decode(oldToken);
            if (!isValidTokenPayload(decodedToken)) {
                console.warn(ERROR_MESSAGES.INVALID_TOKEN_PAYLOAD);
                return res.status(422).send(ERROR_MESSAGES.INVALID_TOKEN_PAYLOAD);
            }
            if (isTokenExpired(decodedToken)) {
                console.warn(ERROR_MESSAGES.TOKEN_EXPIRED);
                return res.status(422).send(ERROR_MESSAGES.TOKEN_EXPIRED);
            }
            yield create(res, user);
        }
        catch (error) {
            console.error("Error refreshing token:", error);
            return res.status(500).send(ERROR_MESSAGES.REFRESH_ERROR);
        }
    });
}
exports.refresh = refresh;
function isValidTokenPayload(decodedToken) {
    return (decodedToken &&
        typeof decodedToken === "object" &&
        "exp" in decodedToken &&
        typeof decodedToken.exp === "number");
}
function isTokenExpired(decodedToken) {
    const exp = decodedToken.exp;
    if (typeof exp === "number") {
        return Date.now() > exp * 1000;
    }
    return false;
}
// Function to create a new token
function create(res, user) {
    return __awaiter(this, void 0, void 0, function* () {
        const accessToken = jsonwebtoken_1.default.sign({ id: user.id, email: user.email }, SECRET_KEY, { expiresIn: "2hr" });
        return res.cookie("accessToken", accessToken, {
            httpOnly: true,
            sameSite: "strict",
            secure: true,
        });
    });
}
exports.create = create;
