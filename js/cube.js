class Cube {
    constructor(ctx,id){
        this.ctx        = ctx;
        this.positions  = {x:0,y:0};
        this.size       = 10;
        this.id         = id;
    }

	draw() {
		this.ctx.fillRect(this.positions.x, this.positions.y, this.size, this.size);
	}

	move(positions) {
		

		this.draw();
	}

	collision(inimigo) {
		return false;
	}

	grow() {
	}
}