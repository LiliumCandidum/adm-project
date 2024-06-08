CREATE KEYSPACE adm
  WITH REPLICATION = { 
   'class' : 'SimpleStrategy', 
   'replication_factor' : 1 
  };

use adm;

CREATE TABLE adm.artists (
  name text,
  description text,
  albums map<text, text>,
  followers_count int,
  PRIMARY KEY (name)
  );

CREATE TABLE adm.song_likes (
    songCode text,
    name text,
    artist text,
    likes_count int,
    genre text,
    PRIMARY KEY ((songCode), likes_count) 
) WITH CLUSTERING ORDER BY (likes_count DESC);

CREATE TABLE adm.songs (
    songCode text,
    name text,
    length int,
    url text,
    genre text,
    artist text,
    album map<text, text>,
    PRIMARY KEY (name)
);

CREATE TABLE adm.users (
    email text,
    username text,
    password text,
    playlists list<frozen<map<text, text>>>,
    liked_songs list<frozen<map<text, text>>>,
    PRIMARY KEY (email)
);

COPY adm.artists (name, description, albums, followers_count) FROM '/bitnami/artists.csv' WITH DELIMITER=',' AND HEADER=TRUE;

COPY adm.songs FROM '/bitnami/songs.csv' WITH DELIMITER='|' AND HEADER=TRUE;

COPY adm.song_likes FROM '/bitnami/song_likes.csv' WITH DELIMITER='|' AND HEADER=TRUE;

COPY adm.users FROM '/bitnami/users1.csv' WITH DELIMITER='|' AND HEADER=TRUE;
