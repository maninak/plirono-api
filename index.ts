import * as bodyParser from 'body-parser';
import * as express from 'express';
import * as mongoose from 'mongoose';

let app: express.Application = express();

mongoose.connect('mongodb://localhost/mydb');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true,
}));

let server = app.listen(3000, () => {
  console.log('Server listening on port 3000');
});
