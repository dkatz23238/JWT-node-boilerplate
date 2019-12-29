# Backend App with JWT Auth

Basic boilerplate for building a secure backend in node.js, express, mongodb using JWOT access and refresh tokens.

## Todo

- Add Schema Validation
- Automatic Documentation

### Auth flow

1. User signs up by providing user and password.
2. User logs in, client receives access and refresh token.
3. Client uses access token to request resources from backend.
4. If access token expires, refresh token is used to retrieves a new valid access tokens.
5. When User logs out, client sends refresh token to logout to invalidate the refresh token.
6. After client invalidates refresh token, no access tokens or refresh tokens can be generated.

### Endpoints

| Endpoint  | Verb   | Body                                                     | Response on Success                                                                                                                                    |
| --------- | ------ | -------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `/login`  | `POST` | `{"username":<Your Username>, "password":"supersecret"}` | `{ "success":true,"err":null,"_id":<Unique User ID> "username":<Your Username>, "accessToken":<JWT Access Token>, "refreshToken":<JWT Refresh Token>}` |
| `/logout` | `POST` | `{"refreshToken":<JWT Refresh Token>}`                   | `{"success":true,"err":null,"invalidatedRefreshToken":<JWT Refresh Token>}`                                                                            |
| `/signup` | `POST` | `{"username":<Your Username>, "password":"supersecret"}` | `{"success":true,"err":null,"_id":<Unique User ID> "username":<Your Username>}`                                                                        |
| `/tokens` | `POST` | `{"refreshToken":<JWT Refresh Token>}`                   | `{"success":true,"err":null,"accessToken":<JWT Access Token>"}`                                                                                        |
