
import * as express from 'express';
import * as mongodb from 'mongodb';

let app = express();


app.post('/register', function (req, res) {
    let contentLength = new Number(req.headers['content-length']).valueOf();
    if (contentLength > 0) {
        getPostObject(req).then(data => {
            console.log(data);
        });
    }
    res.send();
});

app.use('/*', function (req: express.Request, res: express.Response) {
    res.send('hello world!');
});

app.use('/*', async function (value, req, res, next) {
    if (value instanceof Promise) {
        value
            .then((obj) => outputToResponse(res, obj))
            .catch((err) => outputError(res, err));
    }
    else if (value instanceof Error) {
        outputError(res, value);
        res.end();
    }
    else {
        outputToResponse(res, value);
        res.end();
    }

} as express.ErrorRequestHandler);


function outputToResponse(response: express.Response, obj: any) {
    console.assert(obj != null);
    response.statusCode = 200;
    response.write(JSON.stringify(obj));
    response.end();
}

function outputError(response: express.Response, err: Error) {
    console.assert(err != null);
    response.statusCode = 200;
    let outputObject = { message: err.message, name: err.name, stack: err.stack };
    response.write(JSON.stringify(outputObject));
    response.end();
}


function getPostObject(request) {
    let method = (request.method || '').toLowerCase();
    let length = request.headers['content-length'] || 0;
    if (length <= 0)
        return Promise.resolve({});
    return new Promise((reslove, reject) => {
        request.on('data', (data) => {
            try {
                let obj;
                obj = JSON.parse(data.toString());
                reslove(obj);
            }
            catch (exc) {
                reject(exc);
            }
        });
    });
}

app.listen(3020);
