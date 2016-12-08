import * as services from 'services';
services.error.add((sender, error: Error) => {
    console.assert(error != null);
    alert(error.message);
});

