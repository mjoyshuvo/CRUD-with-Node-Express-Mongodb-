const mongoose = require('mongoose');
const User = require('./models/User');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');

//-----------middleware for body-parser------------
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//----replacing mongoose promise to global promise----
mongoose.Promise = global.Promise;

//--------connect to database with mongoose--------------------
mongoose.connect('mongodb://localhost:27017/mongoose').then(db => {
    console.log('---------mongo connected--------');
}).catch(error => console.log(error));

//--------app landing page route----------
app.get('/', (req, res) => {
    res.send('Shuvo');
});

//--------POST route(CREATE)------------
app.post('/users', (req, res) => {

    const newUser = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        isActive: req.body.isActive
    });

    // newUser.save(function(err, dataSaved) {
    //     if (err) return err;
    //     console.log(dataSaved);
    // });

    newUser.save().then(savedUser => {
        res.send('User Saved');
    }).catch(err => {
        res.status(404).send(`User not saved because.......${err}`);
    });
});

//----------GET route (GET)-------------
app.get('/users', (req, res) => {
    User.find({}).then(users => {
        res.status(200).send(users);
    }).catch(err => {
        res.status(404).send('Error while fetching users');
    });
});

//---------PATCH route (UPDATE)---------------------
app.patch('/users/:id', (req, res) => {
    let id = req.params.id;
    let firstName = req.body.firstName;

    User.findByIdAndUpdate(id, { $set: { firstName: firstName } }, { new: true }).then(updatedUser => {
        res.send('User updated by id through PATCH');
    });
});

// app.delete('/users/:id', (req, res) => {
//     User.remove({ _id: req.params.id }).then(userRemoved => {
//         res.send(`User ${userRemoved.firstName} removed`);
//     });
// });

//-----------------DELETE route (DELETE)------------------------
app.delete('/users/:id', (req, res) => {
    User.findByIdAndRemove(req.params.id).then(userRemoved => {
        res.send(`User ${userRemoved.firstName} removed`);
    }).catch(err => {
        res.status(404).send(`User not deleted. Error:${err}`);
    });
});

const port = 2222 || process.env.PORT;

app.listen(port, () => {
    console.log(`======Listening to port ${port}======`);
});