
import * as express from 'express';

let app = express();
app.use('/*', function (req: express.Request, res: express.Response) {
    res.send('hello world!');
});

app.listen(3020);
