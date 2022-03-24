import express, { Request, Response, NextFunction } from 'express'

function ensureLogIn(req: Request, res: Response, next: NextFunction) {
  if (req.signedCookies.user_id) {
    next()
  } else {
    res.status(401)
    next(new Error('Un-authorized'))
  }
}

function allowAccess(req: Request, res: Response, next: NextFunction) {
  if (req.signedCookies.user_id == req.params.id) {
    next()
  } else {
    res.status(401)
    next(new Error('Un-authorized'))
  }
}

export { ensureLogIn, allowAccess }