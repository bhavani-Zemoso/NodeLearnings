import express, { NextFunction } from 'express';

const errorResponse: express.ErrorRequestHandler = (
	error,
	request: express.Request,
	response: express.Response,
	_next: NextFunction
) => {
	const { status, message, data } = error;

    const newStatus = status ? status : 500
    const newMessage = message ? message : 'Unexpected error has occured'

	response.status(newStatus).json({ message: newMessage, data: data });
};

export default errorResponse;