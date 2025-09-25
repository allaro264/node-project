import type { IncomingMessage, ServerResponse } from "http";
import { authSchema, createUser, findUserByEmail, HttpMethod, validatePassword } from "../models";
import { safeParse } from "valibot";
import { parseBody } from "../utils/parseBody";
import { sign } from "jsonwebtoken";
import { config } from "process";


export const authRouter = async (req: IncomingMessage, res: ServerResponse) => {
    const { method, url } = req;

    if (url === "/auth/register" && method === HttpMethod.POST) {
        const body = await parseBody(req);
        const result = safeParse(authSchema, body);

        if (result.issues){
            res.statusCode= 400;
            res.end(JSON.stringify({message: "Bad Request"}));
        }

        const {email, password} = body;

        try{
            const user = await createUser(email, password);

            res.statusCode = 201;
            res.end(JSON.stringify(user));
        } catch (err) {
            if (err instanceof Error){
                res.end(JSON.stringify({ message: err.message}));
            }else{
                res.end(JSON.stringify({message: "Intenal server Error"}))
            }
        }
    }

    if (url === "/auth/login" && method === HttpMethod.POST){
        const body = await parseBody(req);
        const result = safeParse(authSchema, body);

        if (result.issues) {
            res.statusCode = 400;
            res.end(JSON.stringify({ message: "Bad Request"}));
        }

        const {email, password} = body;
        const user = findUserByEmail(email);

        if (!user || !(await validatePassword(user.password))){
            res.statusCode = 401;
            res.end(JSON.stringify({ message: "Invalid email or password"}));
            return;
        }

        const refresToken = sign(
            {id: user.id},
            config.jwtSecret,
            {expresIn: "1h"}
        )
        
    }
}