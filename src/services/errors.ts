export function queryStringRequired(headerName: string) {
    let msg = `The query string is not contains '${headerName}' item.`
    let err = new Error(msg);
    err.name = 'HeaderRequired';
    return err;
}