const fs      = require('fs');
const path    = require('path');
const express = require('express');

const PORT       = 5000;
const USERS_JSON = path.join(__dirname, 'users.json')
const app        = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


//  Get all users
app.get('/users', async (req, res) => {
    try {
        const USERS = fs.readFileSync(USERS_JSON, {encoding: 'utf-8'});

        const UsersArr = JSON.parse(USERS);

        res.json({
            users: UsersArr
        })
    }
    catch (e) {
        console.log(e.message);
    }
});


//  Get user by ID
app.get('/users/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const USERS = fs.readFileSync(USERS_JSON, {encoding: 'utf-8'});
        const UsersArr = JSON.parse(USERS);
        const data = {
            user: null,
            error: 0,
            message: null
        };

        const user = UsersArr.find(user => user.id === +id);

        if( user ){
            data.user = user
        }else{
            data.error += 1;
            data.message = `User with ID: ${id} does not exist!`;
        }

        res.json({
            data
        })
    }
    catch (e) {
        console.log(e.message);
    }
})


//  Post New User
app.post('/users', async (req, res) => {
    try {
        const USERS = fs.readFileSync(USERS_JSON, {encoding: 'utf-8'});
        const UsersArr = JSON.parse(USERS);
        const { username, age } = req.body;

        const data = {
            users: [],
            error: 0,
            message: null
        };

        if( username.length < 3 ){
            data.error += 1;

            data.message = 'Length of Username should be more then 3!';

            res.status(400).json({
                data
            })
        }

        if( age <= 0 ){
            data.error += 1;

            data.message = 'Age should be more then 0!';

            res.status(400).json({
                data
            })
        }


        if( data.error === 0 ){
            UsersArr.push(req.body);

            fs.writeFileSync(USERS_JSON, JSON.stringify(UsersArr));

            const NEW_USERS = fs.readFileSync(USERS_JSON, {encoding: 'utf-8'});

            data.users = JSON.parse(NEW_USERS);
            data.message = 'User has been created!';

            res.status(201).json({
                data
            })
        }
    }
    catch (e) {
        console.log(e.message);
    }
})


//  Update User
app.put('/users/:id', (req, res)=>{
    const { id } = req.params;

    const USERS = fs.readFileSync(USERS_JSON, {encoding: 'utf-8'});
    const UsersArr = JSON.parse(USERS);
    const data = {
        users: null,
        error: 0,
        message: null
    };

    const user = UsersArr.find(user => user.id === +id);
    const {username, email, age} = req.body;

    if( user ){
        if( typeof username !== "undefined" ){
            if( username.length < 3 ){
                data.error += 1;

                data.message = 'Length of Username should be more then 3!';

                res.status(400).json({
                    data
                })
            }else{
                user.username = username
            }
        }

        if( typeof email !== "undefined" ){
            user.email = email
        }

        if( typeof age !== "undefined" ){
            if( age <= 0 ){
                data.error += 1;

                data.message = 'Age should be more then 0!';

                res.status(400).json({
                    data
                })
            }else{
                user.age = age
            }
        }

        if( data.error === 0 ) {
            data.users = UsersArr;
            data.message = `User with ID: ${id} has been updated!`;
        }
    }else{
        data.error += 1;
        data.message = `User with ID: ${id} does not exist!`;

        res.status(400).json({
            data
        })
    }

    if( data.error === 0 ) {
        fs.writeFileSync(USERS_JSON, JSON.stringify(UsersArr));

        res.json({
            data
        })
    }
})


//  Delete User
app.delete('/users/:id', (req, res)=>{
    const { id } = req.params;

    const USERS = fs.readFileSync(USERS_JSON, {encoding: 'utf-8'});
    const UsersArr = JSON.parse(USERS);
    const data = {
        users: null,
        error: 0,
        message: null
    };

    const user = UsersArr.find(user => user.id === +id);

    if( user ){
        const index = UsersArr.findIndex(user => user.id === +id);

        UsersArr.splice(index, 1);

        fs.writeFileSync(USERS_JSON, JSON.stringify(UsersArr));

        res.sendStatus(204)
    }else{
        data.error += 1;
        data.message = `User with ID: ${id} does not exist!`;

        res.status(400).json({
            data
        })
    }
})

app.listen(PORT, () => {
    console.log('The Server has been started!');
})