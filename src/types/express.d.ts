import { User } from '../models/User';
import express from 'express';

declare module 'express' {
  export interface Request {
    user?: User;
  }
}