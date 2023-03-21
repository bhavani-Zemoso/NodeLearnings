import express, { NextFunction } from 'express';
declare const pug: any;

export const get404 = (
	_req: express.Request,
	res: express.Response,
	_next: NextFunction
) => {
	res.status(404).render('error', { pageTitle: 'Page not found', path: '' });
};
