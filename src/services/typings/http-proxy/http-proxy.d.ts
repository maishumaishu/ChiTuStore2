

declare module 'http-proxy' {
    import * as http from 'http';
    import * as https from 'https';
    import * as url from 'url';

    interface HttpProxyServer {
        on: (name: string, callback: (err, req: http.ClientRequest, res: http.ClientResponse) => void) => void
        web(req, res, options),
        listen: (port: number) => void
    }

    function createProxyServer(options: {
        target?: string,
        forward?: string,
        agent?: https.Agent,
        ssl?: https.Server,
        ws?: boolean,
        xfwd?: boolean,
        secure?: boolean,
        toProxy?: boolean,
        localAddress?: string,
        headers: any
    }): HttpProxyServer;

    function createServer(options: {
        target: string,
    })
}