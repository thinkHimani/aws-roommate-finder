const AWS = require('aws-sdk');
AWS.config.update({
    region: 'us-east-1'
})
const dynamodb = new AWS.DynamoDB.DocumentClient();
const userTable = 'users';
const util = require('../utils/util')
const bcrypt = require('bcryptjs');
const auth = require('../utils/auth');

async function login(user) {
    const username = user.username;
    const password = user.password;
    if (!user || !username || !password) {
        return util.buildResponse(401, {
            message: 'Username or password incorrect'
        })
    }

    const dynamoUser = await getUser(username.toLowerCase().trim())
    if (!dynamoUser || !dynamoUser.username) {
        return util.buildResponse(403, {
            message: "User doesn't exist"
        })
    }

    if (!bcrypt.compareSync(password, dynamoUser.password)) {
        return util.buildResponse(403, {
            message: 'Password incorrect'
        })
    }

    // If everything matches, we return user with access token
    const userInfo = {
        username: dynamoUser.username,
        name: dynamoUser.name
    }

    const token = auth.generateToken(userInfo)
    const response = {
        user: userInfo,
        token: token
    }

    return util.buildResponse(200, response);
}

async function getUser(username) {
    const params = {
        TableName: userTable,
        Key: {
            username: username
        }
    }
    return await dynamodb.get(params).promise().then(res => {
        return res.Item;
    }, error => {
        console.error('There is an error', error);
    })
}

module.exports.login = login;