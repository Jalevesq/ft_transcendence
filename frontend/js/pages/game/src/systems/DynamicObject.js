import { Loop } from "./Loop.js";
import { StaticObject } from "./StaticObject.js";

class DynamicObject extends StaticObject {
	constructor(...args) {
		super(...args);
		Loop.addUpdatable( this );
	}

	update() {
		console.warn( "DynamicObject: update() called while undefined!" );
	}
	
	delete() {
		// super.delete();
		Loop.removeUpdatable( this );
	}
}

export { DynamicObject };
