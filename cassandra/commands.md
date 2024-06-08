## set up cassandra

docker pull cassandra:latest

docker network create cassandra 

docker run --rm -d --name cassandra --hostname cassandra --network cassandra cassandra

Con volume:
docker run --rm -d -v $(pwd)/tables:/bitnami --name cassandra --hostname cassandra --network cassandra cassandra

## for writing queries 

docker exec -it cassandra /bin/sh

cqlsh

-- runnare comando x creare keyspace --

Usa keyspace:
use adm

Get tables:
describe tables

## bigger field size (for users import)
https://stackoverflow.com/questions/49971767/cannot-copy-csv-file-inside-a-cassandra-table (ultima risposta)

From /bin/sh:
cp ./etc/cassandra/cqlshrc.sample $HOME/.cassandra

Go in $HOME/.cassandra and rename file:
mv cqlshrc.sample cqlshrc

Edit cqlshrc file and set field_size_limit:
[csv]
;; The size limit for parsed fields
field_size_limit = 1000000000


## copy files
cp -r ./tables $HOME/adm