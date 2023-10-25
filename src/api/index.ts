import { Router } from 'express';
import auth from './routes/userRoute';
import user from './routes/userRoute';
import role from './routes/roleRoute';
import building from './routes/buildingRoute';
import floor from './routes/floorRoute'
import passageway1 from './routes/passagewayRoute'
import elevator from './routes/elevatorRoute'

export default () => {
	const app = Router();

	auth(app);
	user(app);
	role(app);
	building(app);
	floor(app);
	passageway1(app);
	elevator(app);
	return app
}

function passageway(app: Router) {
	throw new Error('Function not implemented.');
}
