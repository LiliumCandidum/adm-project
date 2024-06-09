# ADM Project

Partecipants: Paola Nicosia.

This repository contains a script and useful commands to create a database with Cassandra. It uses the [30000 Spotify songs](https://www.kaggle.com/datasets/joebeachcapital/30000-spotify-songs) dataset to generate data for the database.

## How to

First of all, make sure you have node and Docker installed on your computer.

### Generate data for DB

Execute the following commands to generate csv files to use for populating Cassandra:

1. `npm i`
2. `node ./src/script.js`

Now you should have a folder called `tables` with inside four csv files: `artists.csv`, `songs.csv`, `song_likes.csv` and `users.csv`.

### Run Cassandra

Execute the commands written on the `/cassandra/commands.md` file to run Cassandra and open the CQL shell.
The, execute the CQL commands written on the `/cassandra/data.cql` file to create the keyspace, the needed tables, populate them and execute the queries related to the workload.