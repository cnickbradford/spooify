import http from "k6/http";
import { check, sleep } from "k6";

export default function () {
  // Test for user getting all playlist
  const res1 = http.get("http://localhost:4000/api/playlists");
  check(res1, {
    "http status is 200": (r) => r.status === 200,
  });

  // Test for user adding a track to a playlist
  const res2 = http.post(
    "http://localhost:4000/api/playlists/3cHyrEgdyYRjgJKSOiOtcS"
  );
  check(res2, {
    "http status is 200": (r) => r.status === 200,
  });

  // Test for deleting a track from a playlist
  const res3 = http.del(
    "http://localhost:4000/api/playlists/3cHyrEgdyYRjgJKSOiOtcS"
  );
  check(res3, {
    "http status is 200": (r) => r.status === 200,
  });

//   sleep(1); // Optional sleep statement between iterations
}
