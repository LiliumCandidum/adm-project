// Keyspace ------------------------------------------------------

CREATE KEYSPACE adm
  WITH REPLICATION = { 
   'class' : 'SimpleStrategy', 
   'replication_factor' : 1 
  };

use adm;


// Tables ---------------------------------------------------------

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

CREATE INDEX ON song_likes(artist);

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


// Import data ---------------------------------------------------

COPY adm.artists (name, description, albums, followers_count) FROM '/bitnami/artists.csv' WITH DELIMITER='|' AND HEADER=TRUE;

COPY adm.songs (songCode, name, length, url, genre, artist, album) FROM '/bitnami/songs.csv' WITH DELIMITER='|' AND HEADER=TRUE;

COPY adm.song_likes (songCode, name, artist, likes_count, genre) FROM '/bitnami/song_likes.csv' WITH DELIMITER='|' AND HEADER=TRUE;

COPY adm.users (username, email, password, playlists, liked_songs) FROM '/bitnami/users.csv' WITH DELIMITER='|' AND HEADER=TRUE AND CHUNKSIZE=1;


// Queries ----------------------------------------------------------

// Query 1
SELECT likes_count FROM song_likes WHERE songCode = '1hr5Y2i4NlE3LPvQZ9Q5Ao';

// Query 2
// RIVEDERE!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
SELECT *
FROM song_likes
WHERE artist = 'Ed Sheeran'
ORDER BY likes_count DESC
LIMIT 3;

// Query 3
SELECT liked_songs FROM users WHERE email = 'dialogueplayful@email.it';

// Query 4
SELECT name, followers_count FROM artists;

// Query 5
SELECT playlists FROM users WHERE email = 'emergevegetable@email.it';

// Query 6
SELECT albums FROM artists WHERE name = 'Phantoms';

// Query 7
SELECT * FROM songs WHERE name = 'Ruin My Life - Steve James Remix';
