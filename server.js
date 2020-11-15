let ChatUser = require('./chatuser');
let express = require('express');
let app = express();
app.use(express.static(__dirname));
app.listen(process.env.PORT || 8080, () => console.log('Server is runing'));
let bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
var cookieParser = require('cookie-parser')();
app.use(cookieParser);
var session = require('cookie-session')({ keys: ['secret'], maxAge: 1 * 60 * 60 * 1000 });
app.use(session);



const passport = require('passport');
app.use(passport.initialize());
app.use(passport.session());
const LocalStrategy = require('passport-local').Strategy;

var auth = passport.authenticate('local', { successRedirect: '/', failureRedirect: '/login' });
app.get('/login', function(req, res) {
    res.sendFile(__dirname + '/login.html');
});
app.post('/login', auth);
//перевірка чи user автентифікований
app.get('/', function(req, res) {
    if (req.isAuthenticated()) {
        res.sendFile(__dirname + '/chat.html');
    } else {
        res.redirect('/login');
    }
});

app.post('/adduser', function(req, res) {
    var user = new ChatUser(req.body);
    user.save(function(err, data) {
        if (err) console.log(err.message);
        res.send('add user!');
    })
});

//логування
passport.use(new LocalStrategy(function(login, password, done) {
    ChatUser.find({
        login: login,
        password: password
    }, function(err, data) {
        if (data.length) {
            return done(null, { id: data[0]._id, login: data[0].login, password: data[0].password });
        } else {
            console.log("'Incorrect login or password'");
            return done(null, false);
        }
    })

}));

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(user, done) {
    ChatUser.find({ _id: user.id }, function(err, data) {
        if (data.length == 1)
            done(null, { _id: data[0].id });
    });
})

// module.exports.logout = (req, res) => {
//     console.log('logout', req.session);
//     req.logout();
//     req.session.destroy(() => {
//         res.redirect('/');
//     });
// }

// app.get('/logout', function(req, res) {
//     console.log('logout', req.session); // cookie { passport: {...}}
//     req.logout(); // cookie { no_passport}
//     req.session.destroy(() => {
//         res.redirect('/login');
//     });
// })

var server = require('http').createServer(app);
var io = require('socket.io')(server);
server.listen(3000);

io.use(function(socket, next) {
    var req = socket.handshake;
    var res = {};
    cookieParser(req, res, function(err) {
        if (err)
            return next(err);
        session(req, res, next);
    });
});

let users = [];
let colpos = -1;
let colors = ["bg-col1", "bg-col2", "bg-col3", "bg-col4", "bg-col5", "bg-col6"];
let discuser;

io.on('connection', function(socket) {
    console.log('11111111111', Object.keys(io.sockets.sockets));
    if ((socket.handshake.session.passport === undefined) && (socket.handshake.session.passport.user.login == undefined)) {
        console.log("----------------------------------");
    } else {
        console.log("New user connected");
        var user = socket.handshake.session.passport.user.login;
        socket.login = user;
        var pos = users.indexOf(user);
        discuser = pos;
        if (pos == -1)
            users.push(user);
        if (colpos < 5) colpos++;
        else colpos = 0;
        socket.color = colors[colpos];
        // console.log("1users", users);
        // console.log('22222222222', Object.keys(io.sockets.sockets));
    };


    socket.on('joinclient', function() {
        socket.broadcast.emit('joinserverforusers', {
            message: user + " has joined the chat.",
            users: users
        });
        socket.emit('joinserverforclient', {
            message: "Hello " + user + "!"
        });
        io.sockets.emit('usersonline', {
            users: users
        });
    });


    socket.on('disconnect', function() {
        console.log(`user ${user} disconnected`);
        users.forEach(function(item, index) {
            if (item === user) users.splice(index, 1);
        });
        socket.broadcast.emit('disconnectThatSoc', {
            message: user + " disconnect.",
            users: users
        });
        console.log("2users", users);
        console.log('22222222222', Object.keys(io.sockets.sockets));
        // socket.disconnect();
    });

    // socket.on('logout', function(data) {
    //     console.log(data);
    //     users.forEach(function(item, index) {
    //         if (item === user) Object.keys(io.sockets.sockets).splice(index, 1);
    //     });
    // })

    socket.on('newmessage', (data) => {
        io.sockets.emit('newmessage', { message: data.message, login: socket.login, color: socket.color })
    })
});