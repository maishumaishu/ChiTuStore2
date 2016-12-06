export function queryStringRequired(itemName: string) {
    let msg = `The query string is not contains '${itemName}' item.`
    let err = new Error(msg);
    err.name = 'QueryStringRequired';
    return err;
}
export function headerRequired(headerName: string) {
    let msg = `Header '${headerName}' is required.`;
    let err = new Error(msg);
    err.name = 'HeaderRequired';
    return err;
}