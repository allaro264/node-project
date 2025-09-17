import { compare, hash } from "bcrypt";
import { pipe, string, email, minLength, object, type InferInput  } from "valibot";

const emailScchema = pipe(string(), email());
const passwordSchema = pipe(string(), minLength(6));

export const authSchema = object({
email: emailScchema,
password: passwordSchema
})

export enum Role {
    "ADMIN" = "admin",
    "USER" = "user"

}

export type User = InferInput<typeof authSchema> & {
    id: number;
    role: Role;
    refreshToken?: string;
}

const users: Map<string, User> = new Map();

/**
 * creates a new user with the given email and password
 * The password is hashed before storing.
 * 
 * @param {string} email - the email of the user
 * @param {string} password - the password of the user
 * @returns {Promise<User>} - The created user
 */

export const createUser = async(
    email: string,
    password: string
): Promise<User> => {
const hashedPassword = password = await hash(password, 10)

const newUser: User = {
    id: Date.now(),
    email,
    password: hashedPassword,
    role: Role.USER
}

users.set(email, newUser,);
return newUser;
}
 
/**
 * Finds a user by their email.
 *
 * @param  
 * @retur export const findUserByEmail = (email: string): User | undefined => {}
 */
export const findUserByEmail = (email: string): User | undefined => {
    return users.get(email);
}

/**
 * validates a user's password
 * 
 * @param {User} user - the user whose password is to be validated
 * @param {string} password - the password to validate
 * @returns {Promise<boolean>} - true if the password is valid, otherwise false
 */
export const validatePassword = async (
    user: User,
    password: string
): Promise<boolean> => {
    return compare(password, user.password);
}

/**
 * Rovokes token
 * 
 * @apram {string} email - the email of the user to rovoke the token
 * @return {boolean} - true if the token is revoked, otherwise flase.
 */
export const revokeUserToken = (email: string): boolean => {
    const foundUser = users.get(email);
    if (!foundUser){
        return false;
    }

    users.set(email, { ...foundUser, refreshToken: undefined });
    return true;
}