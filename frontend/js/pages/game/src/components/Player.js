import { Collider } from '../modules/Collider.js';
import { Updatable } from '../modules/Updatable.js';
import { Layers } from '../systems/Layers.js';
import { InputMap } from '../systems/InputManager.js';
import { Paddle } from './Paddle.js';
import {
	Raycaster,
	Vector3
} from 'three';
import { World } from '../World.js';

const initialSpeed = 6;
const initialBoostSpeed = 50;

class Player extends Paddle {
	constructor( position, id, nickname ) {
		super( position, id, nickname );

		this.isPlayer = true;

		this.speed = initialSpeed;
		this.movement = new Vector3( 0, 0, 0 );

		this.ray = new Raycaster();
		this.ray.layers.set( Layers.Solid );

		this.wsData = {
			id: this.sideId,
			pos: this.position,
			ballInst: undefined
		};

		this.collider = new Collider( this );
		this.updatable = new Updatable( this );

		this.boostButtonPressedEvent = (e) => {
			if ( this.speed == initialSpeed )
				this.speed = initialBoostSpeed;
		};
		this.boostButtonReleasedEvent = (e) => {
			// this.speed = initialSpeed;
		};
		this.reflectButtonPressedEvent = (e) => {
			const ball = World._instance.balls.ballInst[0];
			if ( ball.pos.y < (this.position.y - this.length / 2) || ball.pos.y > (this.position.y + this.length / 2) ) {
				console.log( "not in y range");
				return;
			}
			if ( Math.abs( ball.pos.x - this.position.x ) > 2 ) {
				console.log( "not close enough");
				return;
			}
			if ( Math.sign( ball.dir.x ) != Math.sign( position.x ) ) {
				console.log( "wrong way");
				return;
			}
			console.log( "SMASH! ");
			const pos = new Vector3(
				this.position.x,
				World._instance.balls.ballInst[0].pos.y,
				this.position.z
			);
			World._instance.balls.playerCollision( World._instance.balls.ballInst[0], pos, this );
			World._instance.balls.ballInst[0].smashed = true;
			World._instance.balls.ballInst[0].dir.normalize();
			this.onCollision( World._instance.balls.ballInst[0] );
		};
		if ( World._instance.currentGameMode == "Upgraded" ) {
			document.addEventListener( "boostButtonPressed", this.boostButtonPressedEvent );
			document.addEventListener( "boostButtonReleased", this.boostButtonReleasedEvent );
			document.addEventListener( "reflectButtonPressed", this.reflectButtonPressedEvent );
		}
	}

	fixedUpdate ( dt ) {
		if ( World._instance.socket != undefined && World._instance.socket.readyState === WebSocket.OPEN) {
			World._instance.socket.send( JSON.stringify( this.wsData ) );
		}
	}

	update( dt ) {
		this.movement = new Vector3( 0, InputMap.movementAxis.value, 0 );

		if ( this.speed > initialSpeed ) {
			this.speed -= initialBoostSpeed * dt * 8;
			if ( this.speed < initialSpeed )
				this.speed = initialSpeed;
		}
		if ( this.movement.y === 0 )
			return;
		
		this.ray.set( this.position, this.movement );
		this.ray.far = this.length / 2 + this.speed * dt;
		const hits = this.ray.intersectObjects( Collider.getSolids() );
		if ( hits.length > 0 ) {
			this.position.add( this.movement.clone().multiplyScalar( hits[0].distance - this.length / 2 ) );
		} else {
			this.position.add( this.movement.clone().multiplyScalar( this.speed * dt ) );
		}
	}

	onCollision( hit ) {
		if ( World._instance.socket != undefined && World._instance.socket.readyState === WebSocket.OPEN) {
			this.wsData.ballInst = hit;
			World._instance.socket.send( JSON.stringify( this.wsData ) );
		}
		this.wsData.ballInst = undefined;
	}

	delete() {
		super.delete();
		this.updatable.delete();
		this.collider.delete();
		if ( World._instance.currentGameMode == "Upgraded" ) {
			document.removeEventListener( "boostButtonPressed", this.boostButtonPressedEvent );
			document.removeEventListener( "boostButtonReleased", this.boostButtonReleasedEvent );
			document.removeEventListener( "reflectButtonPressed", this.reflectButtonPressedEvent );
		}
	}
}

export { Player };
