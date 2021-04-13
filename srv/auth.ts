
import jsonwebtoken from 'jsonwebtoken'
import { StringFormat, NumberSign, Validate, Private, Internal } from './utils';

export const secret = "c2d26e94-7b5f-4d63-a821-695f4703c2a2"

export const userDB : {
    [email : string] : User
} = {};

export class User {
    @Validate
    @StringFormat(/^[^0-9!"#$%&'()*,\-.\/:;<>?@\[\\\]\^_`{|}~]*$/)
    username! : string

    @Validate
    @StringFormat(/^[A-Za-z0-9]{1}[A-Za-z0-9_.-]*@{1}[A-Za-z0-9_.-]+\.[A-Za-z0-9]+$/)
    email! : string

    @Validate
    @StringFormat(/^[0-9]+[0-9\-]*[0-9]+$/)
    @Private
    phone! : string

    @Validate
    @Internal
    password! : string

    @Validate
    @NumberSign('+')
    @Private
    age! : number
}

export function signJwt(sub : string): string {
    return jsonwebtoken.sign({sub: sub}, secret, {
        algorithm: "HS256",
    });
}

export function checkJwt(token : string) : User {
    const payload : any = jsonwebtoken.verify(token, secret, {
        algorithms: ["HS256"],
    });

    if(!payload.sub) throw new Error("Invalid sub")
    return userDB[payload.sub];
}
