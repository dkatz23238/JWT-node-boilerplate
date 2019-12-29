set -e

curl --silent -H "Content-Type: application/json" -d '{"username":"jose2", "password":"jose123"}' http://localhost:8080/signup | jq

curl -H "Content-Type: application/json" -d '{"username":"jose2", "password":"jose123"}' http://localhost:8080/login | jq

export JWT=$(curl --silent -H "Content-Type: application/json" -d '{"username":"jose2", "password":"jose123"}' http://localhost:8080/login | jq -r .accessToken)
export refreshToken=$(curl --silent -H "Content-Type: application/json" -d '{"username":"jose2", "password":"jose123"}' http://localhost:8080/login | jq -r .refreshToken)

curl -H "Content-Type: application/json" -H "Authorization: Bearer $JWT" http://localhost:8080 |jq

export DATA='{"refreshToken":"'$refreshToken'"}'
curl -H "Content-Type: application/json" -d $DATA http://localhost:8080/tokens | jq


curl -H "Content-Type: application/json" -d $DATA http://localhost:8080/logout | jq

echo "All Ok!"
# 
# curl --silent -H "Content-Type: application/json" -d '{"username":"test4", "password":"asdf12345"}' http://localhost:8080/login