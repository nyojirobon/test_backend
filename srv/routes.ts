
import {
    Auth,
    Get,
    Optional,
    Post,
    RouteList,
    Validate,
    ItemType,
    RouteRequest,
    toJSON,
} from './utils'

import {
    signJwt,
    User,
    userDB,
} from './auth'

import bcrypt from 'bcrypt'

class Hello {
    @Validate
    @Optional
    msg! : string
}

class LoginRequest {
    @Validate
    email! : string

    @Validate
    password! : string
}

class GetUserRequest {
    @Validate
    userId! : string
}

class PostRequest {
    @Validate
    postId! : string
}

class ForumPost {
    postId! : string

    // TODO: Task 3 Part 1:



    // End of Task 3 Part 1
}

const posts : {
    [key : string] : ForumPost
} = {};

const saltRounds: number = 10;

export default class Routes extends RouteList {
    @Get
    async foo(req : RouteRequest) {
        return { msg: 'bar' }
    }

    @Post
    async hello(req : RouteRequest, body : Hello) {
        if(body.msg === 'world') {
            return { msg: 'ok' }
        } else {
            return { msg: 'error' }
        }
    }

    // TODO: Task 1 Part 2:

    @Post
    async register(req : RouteRequest, user : User) {
        const hashedPassword: string = bcrypt.hashSync(user.password, saltRounds);
        user.password = hashedPassword;
        userDB[user.email] = user;
        return {
            accessToken: signJwt(user.email)
        }
    }

    // End of Task 1 Part 2

    // TODO: Task 2:

    @Post
    async login(req : RouteRequest, request : LoginRequest) {
        const user: User = userDB[request.email];
        if (!user) {
            return { message: 'email not registered' }
        }

        if (!bcrypt.compareSync(request.password, user.password)) {
            return { message: 'password does not match' }
        }

        return {
            accessToken: signJwt(request.email)
        }
    }

    // End of Task 2

    @Get
    @Auth
    async me(req : RouteRequest) {
        return toJSON(req.user, User, "private");
    }

    @Get("/users/:userId")
    async users(req : RouteRequest, params : GetUserRequest) {
        return toJSON(userDB[params.userId], User, "public");
    }
    
    // TODO: Task 3:

    // Task 3 Part 1: List All Posts
    async posts(req : RouteRequest) {

    }

    // Task 3 Part 2: Create a post associated with current user
    async createPost(req : RouteRequest) {

    }

    // Task 3 Part 3: Update a post
    async patchPost(req : RouteRequest, body : ForumPost, params : PostRequest) {

    }

    // Delete a post
    async deletePost(req : RouteRequest, params : PostRequest) {

    }

    // End of Task 3

    
}

