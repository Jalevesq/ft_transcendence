import { StaticObject } from '../systems/StaticObject.js';
import {
	BoxGeometry,
	Mesh,
	MeshBasicMaterial,
	MeshStandardMaterial,
	Vector2,
	Vector3
} from '../../../node_modules/three/build/three.module.js';

class Terrain extends StaticObject {	
	start( size, lineWidth, margin ) {
		const g_terrain = new BoxGeometry(size.x, size.y, 1);
		const g_lineh = new BoxGeometry(size.x - margin * 2, lineWidth, 10);
		const g_linev = new BoxGeometry(lineWidth, size.y - margin * 2, 10);
		const m_black = new MeshBasicMaterial({ color: 'black' });
		const m_white = new MeshStandardMaterial({ color: 'white' });
		this.object = new Mesh(g_terrain, m_black);
		this.linetop = new Mesh(g_lineh, m_white);
		this.linebot = new Mesh(g_lineh, m_white);
		this.lineright = new Mesh(g_linev, m_white);
		this.lineleft = new Mesh(g_linev, m_white);
		
		this.object.add(this.linetop, this.linebot, this.lineright, this.lineleft);
		
		this.linetop.position.set(0, size.y / 2 - margin - lineWidth / 2, 0);
		this.linebot.position.set(0, -(size.y / 2 - margin - lineWidth / 2), 0);
		this.lineright.position.set(size.x / 2 - margin - lineWidth / 2, 0, 0);
		this.lineleft.position.set(-(size.x / 2 - margin - lineWidth / 2), 0, 0);
		
		this.object.position.z = -10;

		this.SetLayers( 0 );
	}

	// get mesh() { return this.terrain; }
	get lt() { return this.linetop; }
	get lb() { return this.linebot; }
	get lr() { return this.lineright; }
	get ll() { return this.lineleft; }

}

export { Terrain };
