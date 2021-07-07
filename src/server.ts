import Express from "express";

import path from "path";

interface error {
    status?: number;
    message: string;
}

function initialise(app: Express.Express) {
    app.use(Express.json());
    app.use(Express.urlencoded({ extended: false }));

    app.use(Express.static(path.join(__dirname, '..', 'public')));

    // app.use('/', indexRouter);
}

function handlers(app: Express.Express) {
    // Catches the errors
    app.use((_request: Express.Request, _response: Express.Response, next: Express.NextFunction) => {
        const error: error = new Error('Resource not found');
        error.status = 404;
        return next(error);
    });

    app.use((error: error,_request: Express.Request, response: Express.Response, _next: Express.NextFunction) => {
        response.status(error.status).json(error);
    });
}

function init(): Promise<Express.Express> {

    const app = Express();

    return new Promise((resolve, _reject) => {
        initialise(app);
        handlers(app);
        resolve(app);
    })

}

export = init;
