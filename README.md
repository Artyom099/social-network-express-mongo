# Social-network API
This is my pet project which describes endpoints for user interaction with a social network

## Libruaries & modules 
Express-validator, mongodb, mongoose, jest supertest, cookie-parser, bcrypt, nodemailer, jsonwebtoken

## Endpoint's functional
### Auth
1. login
2. password recovery by email
3. set new password
4. create new pair of access & refresh token
5. confirm registration by received confirmation code
6. registration in the system (confirmation code sent to the email)
7. resend confirmation registration email if user exist
8. logout
9. get information about current user

### Blogs
1. get blogs with paging
2. create new blog
3. get all posts for specified blog
4. create new post for specified blog
5. get blog by id
6. update existing blog by id with input model
7. delete blog specified by id

### Comments
1. update existing comment gy id with input model
2. delete comment specified by id
3. ger comment by id

### Posts
1. get comments for speciied post by postId
2. create new comment for speciied post by postId
3. get all posts
4. create new post
5. get post by id
6. update existing post by id with input model
7. delete post specified by id

### Security devices
1. get all devices with active sessions for current user
2. terminate all other (exclude current) device's sessions
3. terminate specified device session

### Users
1. get all users
2. add new user to the system by admin
3. delete user specified by id

### Testing
Clean the datebase
