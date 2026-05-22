import { Router } from "express";
import * as stateController from '@/controllers/state.controller';

const route = Router();

route.get('/', stateController.getAllStates);


export default route;