export JWT=$(curl --silent -H "Content-Type: application/json" -d '{"username":"jose", "password":"jose123"}' http://localhost:8080/login | jq -r .token)

curl -H "Content-Type: application/json" -H "Authorization: Bearer $JWT" http://localhost:8080


# curl --silent -H "Content-Type: application/json" -d '{"username":"jose", "password":"jose123"}' http://localhost:8080/signup
# curl --silent -H "Content-Type: application/json" -d '{"username":"test4", "password":"asdf12345"}' http://localhost:8080/login