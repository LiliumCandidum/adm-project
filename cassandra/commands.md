## Set up cassandra

#### Pull cassandra image

```
docker pull cassandra:latest
```

#### Create a network

```
docker network create cassandra
```

#### Run cassandra image

With a volume (execute in this project root):
```
docker run --rm -v $(pwd)/tables:/bitnami --name cassandra --hostname cassandra --network cassandra cassandra
```

## Run CQL for writing queries 

Before executing the following commands, make sure the cassandra container logged something like: 
`...Created default superuser role 'cassandra'`

#### Execute a shell on the container

```
docker exec -u root -it cassandra /bin/sh
```

#### Run CQL shell

```
cqlsh
```