const express = require("express");
const mysql = require("mysql");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const session = require("express-session");
const cookieparser = require("cookie-parser");

app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST"],
    credentials: true,
  })
);

app.use(cookieparser());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
  session({
    key: "userid",
    secret: "amit",
    resave: false,
    saveUninitialized: false,
    cookie: {
      expires: 60 * 60 * 24,
    },
  })
);
const db = mysql.createConnection({
  host: "localhost",
  user: "sqluser",
  password: "password",
  database: "crud",
});

// app.post("/login", (req, res) => {
//   const User = req.body.user;
//   const Pass = req.body.pass;
//   db.query(
//     "INSERT INTO loginpage(username,password) VALUES(?,?)",
//     [User, Pass],
//     (err, result) => {
//       console.log(err);
//     }
//   );
// });

app.post("/login", (req, res) => {
  const User = req.body.user;
  const Pass = req.body.pass;

  db.query(
    "SELECT * FROM student WHERE username = ? AND password = ?",
    [User, Pass],
    (err, result) => {
      if (err) {
        res.send(err);
      }
      if (result.length > 0) {
        req.session.user = result;
        console.log(req.session.user);
        res.send(result);
      } else {
        res.send({ message: "no user found" });
      }
    }
  );
});

// app.post("/student", (req, res) => {
//   const id = req.body.uid;

//   db.query("SELECT * FROM student WHERE uid = ?;", [id], (err, result) => {
//     if (err) {
//       res.send(err);
//     }
//     if (result.length > 0) {
//       // req.session.user = result;
//       // console.log(req.session.user);
//       res.send(result);
//     } else {
//       res.send({ message: "error" });
//     }
//   });
// });

app.get("/login", (req, res) => {
  if (req.session.user) {
    res.send({ loggedin: true, user: req.session.user });
  } else {
    res.send({ loggedin: false });
  }
});

app.listen(3001, () => {
  console.log("running on port 3001");
});
