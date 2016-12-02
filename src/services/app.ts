
import * as express from 'express';
import * as mongodb from 'mongodb';
import * as http from 'http';
import * as config from './config';

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
    let contentLength = 0;
    if (req.headers['content-length'])
        contentLength = new Number(req.headers['content-length']).valueOf();

    if (contentLength > 0) {
        req.on('data', (data) => {
            request(req, res, data);
        });
    }
    else {
        request(req, res);
    }
});

async function request(req: express.Request, res: express.Response, data?: string | Uint8Array) {
    try {
        let host = config.realServiceHost; //'localhost';
        let port = config.realServicePort; //80;


        console.assert(req.query.appId != null);
        let headers: any = Object.assign({
            'application-id': req.query.appId,
        }, req.headers, { host });

        if (req.query.userId) {
            headers['user-id'] = req.query.userId;
        }

        let request = http.request(
            {
                host: host,
                path: req.originalUrl,
                method: req.method,
                headers: headers,
                port: port
            },
            (response) => {
                console.assert(response != null);
                for (var key in response.headers) {
                    res.setHeader(key, response.headers[key]);
                }
                //res.setHeader('Access-Control-Allow-Origin', '*');
                response.pipe(res);
            }
        );

        if (data) {
            //let text = String.fromCharCode.apply(null, data);
            request.write(data);
        }

        request.end();
    }
    catch (err) {
        outputError(res, err);
    }
}

function combinePaths(path1: string, path2: string) {
    console.assert(path1 != null && path2 != null);
    if (!path1.endsWith('/')) {
        path1 = path1 + '/';
    }

    if (path2[0] == '/') {
        path2 = path2.substr(1);
    }

    return path1 + path2;
}

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
