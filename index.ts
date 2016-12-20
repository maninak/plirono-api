import * as User from './schemas/user.model';
import { IUserModel } from './structures/user.interface';

import * as bodyParser from 'body-parser';
import * as express from 'express';
import * as mongoose from 'mongoose';


let app: express.Application = express();

mongoose.connect('mongodb://localhost/mydb');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true,
}));

/* Create */
app.post('/api/user', (req: express.Request, res: express.Response) => {
  let newUser: IUserModel = new User(req.body);
  newUser.save((err: Error) => {
    if (err) {
      res.json({
        info: 'error during User create',
        error: err,
      });
    }
    res.json({
      info: 'User saved successfully',
      data: newUser,
    });
  });
});

/* Read all */
app.get('/api/user', (req: express.Request, res: express.Response) => {
  User.find((err: Error, Users: IUserModel[]) => {
    if (err) {
      res.json({
        info: 'error during find Users',
        error: err,
      });
    }
    res.json({
      info: 'Users found successfully',
      data: Users,
    });
  });
});

/* Find one */
app.get('/api/user/:name', (req: express.Request, res: express.Response) => {
  let query = {
    name: req.params.name,
  };
  User.findOne(query, (err: Error, User: IUserModel) => {
    if (err) {
      res.json({
        info: 'error during find User',
        error: err,
      });
    }
    if (User) {
      res.json({
        info: 'User found successfully',
        data: User,
      });
    } else {
      res.json({
        info: 'User not found with name:' + req.params.name,
      });
    }
  });
});

let server = app.listen(3000, () => {
  console.log('Server listening on port 3000');
});
