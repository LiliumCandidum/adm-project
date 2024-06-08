const fs = require('fs')
const {parse} = require('csv-parse')
const {usernames} = require('./utils/usernames')

const DELIMITER = '|'
const ARTIST_DESCRIPTION = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua'
const SONG_URL = 'http://localhost:8080/song'

function normalizeData(data) {
  return data.map(val => {
    if(typeof val === 'object') {
      return JSON.stringify(val)
    }
    if(typeof val === 'string' && val.includes(DELIMITER)) {
      return `"${val}"`
    }
    return val
  })
}

function getRandomInt(min, max) {
    const minCeiled = Math.ceil(min);
    const maxFloored = Math.floor(max);
    // The maximum is exclusive and the minimum is inclusive
    return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled);
  }

function writeArtists(artistsMap) {
  const writeStream = fs.createWriteStream('./tables/artists.csv')
  const artists = Array.from(artistsMap.values())

  const header = Object.keys(artists[0]).join(DELIMITER) + '\n'
  writeStream.write(header)
  
  artists.forEach(artist => {
    const values =  normalizeData(Object.values(artist))
    const newLine = values.join(DELIMITER)+ '\n'

    writeStream.write(newLine)
  })

  writeStream.end()

  writeStream.on('finish', () => {
      console.log('finish writing artists.csv')
  }).on('error', (err) => {
      console.log(err)
  })
}

function writeSongs(fileName, songsArray) {
  const writeStream = fs.createWriteStream(fileName)

  const header = Object.keys(songsArray[0]).join(DELIMITER) + '\n'
  writeStream.write(header)
  
  songsArray.forEach(song => {
    const values = normalizeData(Object.values(song))
    const newLine = values.join(DELIMITER)+ '\n'

    writeStream.write(newLine)
  })

  writeStream.end()

  writeStream.on('finish', () => {
      console.log('finish writing ' + fileName)
  }).on('error', (err) => {
      console.log(err)
  })
}

function createAndWriteUsers(playlists, songs) {
  // create users
  const users = usernames.map(username => ({
    username,
    email: `${username}@email.it`,
    password: 'password',
    playlists: playlists.splice(-3).map(([code, name]) => ({code, name})),
    liked_songs: []
  }))
  const usersCount = users.length

  songs.forEach(song => {
    const usersList = []
    for(let i = 0; i < song.likes_count; i++) {
      let userIndex
      do {
        userIndex = getRandomInt(0, usersCount)
      } while (usersList.includes(userIndex))
      usersList.push(userIndex)

      users[userIndex].liked_songs.push({
        code: song.songCode,
        name: song.name,
        genre: song.genre 
      })
    }
  })

  // write on file
  const writeStream = fs.createWriteStream('./tables/users.csv')

  const header = Object.keys(users[0]).join(DELIMITER) + '\n'
  writeStream.write(header)
  
  users.forEach(user => {
    const values = normalizeData(Object.values(user))
    const newLine = values.join(DELIMITER)+ '\n'

    writeStream.write(newLine)
  })

  writeStream.end()

  writeStream.on('finish', () => {
      console.log('finish writing users.csv')
  }).on('error', (err) => {
      console.log(err)
  })
}

function main() {
  console.log('Starts reading songs')

  // Vedere readme.md per relazione index - colonna
  // Ci sono 11'003 artisti e 1139 playlist
  let columns
  const playlists = new Map()
  const artists = new Map()
  const songs = []
  const songLikes = []

  fs.createReadStream('./dataset/spotify_songs.csv')
    .pipe(parse({delimiter: ','}))
    .on('data', row => {
      if(!columns) {
        columns = row
      } else {
        const artistName = row[2]
  
        // Create / update artist
        // Albums are a map of {<albumCode>: <albumName>}
        const artistObj = artists.get(artistName)
        if(artistObj && !artistObj.albums[row[4]]) {
          artists.albums = {
            ...artists.albums, 
            [row[4]]: row[5]
          }
        } else {
          artists.set(artistName, {
              name:artistName,
              description: ARTIST_DESCRIPTION,
              albums: {[row[4]]: row[5]},
              followers_count: getRandomInt(0, usernames.length + 1)
            })
        }
  
        // Create songs
        songs.push({
          songCode: row[0],
          name: row[1],
          length: row[22],
          url: SONG_URL,
          genre: row[9],
          artist: artistName,
          album: {code: row[4], name: row[5]},
        })
  
        // Create song_likes
        songLikes.push({
          songCode: row[0],
          name: getRandomInt(0, 21),
          artist: artistName,
          likes_count: row[3],
          genre: row[9]
        })
  
        playlists.set(row[8], row[7])
      }
    })
    .on('end', function() {
      console.log('Finihed reading, starting writing artists and songs')

      writeArtists(artists)
      writeSongs('./tables/songs.csv', songs)
      writeSongs('./tables/song_likes.csv', songLikes)
      createAndWriteUsers(Array.from(playlists.entries()), songLikes)
    });
}

main()
