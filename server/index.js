//--- depencies ---
import dotenv from "dotenv";
import express from "express";
import SpotifyWebApi from "spotify-web-api-node";
import bodyParser from "body-parser";
import cors from "cors";
const app = express();
dotenv.config();

app.use(express.json());
app.use(cors());
app.use(bodyParser.json());
const PORT = 4000;

import pg from "pg";
const { Pool } = pg;
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});



//--- routes ---

//--- Spotify authentication ---
app.post("/api/login", (req, res) => {
  const code = req.body.code;
  const spotifyWebApi = new SpotifyWebApi({
    redirectUri: process.env.SPOTIFY_REDIRECT_URI,
    clientId: process.env.SPOTIFY_CLIENT_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  });
  spotifyWebApi
    .authorizationCodeGrant(code)
    .then((data) => {
      res.json({
        accessToken: data.body.access_token,
        refreshToken: data.body.refresh_token,
        expiresIn: data.body.expires_in,
      });
    })
    .catch((err) => {
      console.log(err);
    });
});

//--- home route ---
app.get("/", (req, res) => {
  res.send("Hello World");
});

//--- get singular artist ---
app.get("/api/artists/:id", (req, res) => {
  pool
    .query("SELECT * FROM artists WHERE artist_id=$1", [req.params.id])
    .then((result) => {
      res.send(result.rows);
    });
});

//--- get all artist ---
app.get("/api/artists/", (req, res) => {
  pool.query("SELECT * FROM artists").then((result) => {
    res.send(result.rows);
  });
});

//--- get singular track ---
app.get("/api/tracks/:id", (req, res) => {
  pool
    .query(
      "SELECT * FROM Tracks FULL JOIN Albums ON Tracks.album_id=Albums.album_id FULL JOIN Artists ON Tracks.artist_id=Artists.artist_id WHERE Tracks.track_id=$1",
      [req.params.id]
    )
    .then((result) => {
      res.send(result.rows);
    });
});

//--- get all tracks from artist ---
app.get("/api/artist/:id/tracks", (req, res) => {
  console.log(req.params.id);
  pool
    .query(
      "SELECT * FROM Tracks FULL JOIN Albums ON Tracks.album_id=Albums.album_id WHERE Tracks.artist_id=$1",
      [req.params.id]
    )
    .then((result) => {
      res.send(result.rows);
    });
});

//--- get all featuring tracks from artist ---
app.get("/api/featuring/:id", (req, res) => {
  pool
    .query(
      "SELECT * FROM Tracks FULL JOIN Albums ON Tracks.album_id=Albums.album_id WHERE Tracks.featured_artist=$1",
      [req.params.id]
    )
    .then((result) => {
      res.send(result.rows);
    });
});

//--- get singular album ---
app.get("/api/albums/:id", (req, res) => {
  pool
    .query("SELECT * FROM albums WHERE album_id=$1", [req.params.id])
    .then((result) => {
      res.send(result.rows);
    });
});

//--- get all albums of singular artist ---
app.get("/api/artists/:id/albums", (req, res) => {
  pool
    .query("SELECT * FROM albums WHERE artist_id=$1", [req.params.id])
    .then((result) => {
      res.send(result.rows);
    });
});

//--- get all playlists ---
app.get("/api/playlists", (req, res) => {
  pool.query("SELECT * FROM playlists").then((result) => {
    res.send(result.rows);
  });
});

//--- get singular playlist ---
app.get("/api/playlists/:id", (req, res) => {
  pool
    .query("SELECT * FROM Playlists WHERE playlist_id=$1", [req.params.id])
    .then((result) => {
      res.send(result.rows);
    });
});

//--- add track to playlist ---
app.post("/api/playlists/:track_id", (req, res) => {
  pool
    .query("INSERT INTO Playlists (track_id) VALUES ($1)", [
      req.params.track_id,
    ])
    .then((result) => {
      res.send(result.rows);
    });
});

//--- delete track from playlist ---
app.delete("/api/playlists/:track_id", (req, res) => {
  console.log("deleting");
  pool
    .query("DELETE FROM Playlists WHERE track_id=$1", [
      req.params.track_id,
    ])
    .then((result) => {
      res.send(result.rows);
    });
});

//--- setting port listener ---
app.listen(PORT, (error) => {
  if (error) {
    console.error("error");
  } else {
    console.log(`server running at ${PORT}`);
  }
});
