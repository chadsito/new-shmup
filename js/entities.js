//////////////////////////
// ENTITIES
//////////////////////////

// Layers Guide
// 1=EnemyLand, 2=EnemyAir, 3=Particle, 4=Player, 5=pBullet, 6=eBullet, 7=Hud
class Entity {
    constructor(image) {
        this.free = true;
        this.image = image;
        this.width = image?.width;
        this.height = image?.height;
        this.hitbox = new Array(4);
        this.timers = new Array(9);
        // Taken from global: Math object
        this.math = customMath;
        // Taken from global: Used for bullet shooting
        this.pool = pool;
        // Taken from global: Used for queue spawning bullets and particles
        this.queue = game.queuedFns;
        // Taken from global: Used for positioning relative to display
        this.displayWidth = display.width;
        this.displayHeight = display.height;
        // Taken from global: To activate sounds
        this.sfxFlags = game.sfxFlags;
    }
    parentReset(custom){
        // Default hp for living objects
        this.hp = 1;
        // Animation stuff
        this.hitState = 0;
        this.opacity = 100;
        this.rotation = 0;
        this.scale = 1;
        // Timers
        this.timers.fill(0);
        // Flags
        this.dying = false;
        // Custom resets if any
        this.reset1?.(custom);
        this.reset2?.(custom);
        // Always leave hitbox update for the end of reset function
        this.updateHitbox();
        // Useful when chaining method in pool
        return this;
    }
    setupHitbox(xMargin = this.width/2, yMargin = this.height/2, xOffset = 0, yOffset = 0) {
        this.xMargin = xMargin;
        this.yMargin = yMargin;
        this.xOffset = xOffset;
        this.yOffset = yOffset;
    }
    updateHitbox() {
        this.hitbox[0] = this.x - this.xMargin + this.xOffset  //x1 (left)
        this.hitbox[1] = this.x + this.xMargin + this.xOffset  //x2 (right)
        this.hitbox[2] = this.y - this.yMargin + this.yOffset  //y1 (up)
        this.hitbox[3] = this.y + this.yMargin + this.yOffset  //y2 (down)
    }
    spawnParticles(data){
        // If no data received, don't spawn any particles
        if (!data) return;
    
        for (let i = 0; i < data.qty; i++)
        this.queue.push(()=>this.pool.free('Particle','3',data.options));
    }
    timerCount(timeInFrames = 999, timerUsed = 0) {
        // Count until chosen time, using selected timer
        if (this.timers[timerUsed] < timeInFrames) this.timers[timerUsed] += 1;
    }
    // Parent movement functions
    vectorMovement(custom){
        this.x += 
        custom?.xAng !== void 0 ? custom.xAng : M.cos(this.angle) 
        * this.speed;

        this.y -= 
        custom?.yAng !== void 0 ? custom.yAng : M.sin(this.angle) 
        * this.speed;
    }
}

class Player extends Entity {
    constructor(image) {
        super(image);
        this.setupHitbox(2, 2, 0, 2);
        this.explosionData = function() {return {qty: 40, options: {x:this.x, y:this.y,speed: 4}}};
        this.speed = 1.5;
        // this.r__shotBuffer = 5;
        // Taken from global: Used for moving and shooting
        this.buttons = input.buttons;
    }
    reset1() {
        this.outOfBounds = false;
        this.x = this.displayWidth / 2;
        this.y = 95;
    }
    updateData() {
        ////////////
        // SHOT
        ///////////
        // If button pressed & timer has reached destination
        if (this.buttons[4] > 0 && this.timers[0] === 6) {
            // Queue 2 bullets
            this.queue.push(() => { this.pool.free('PlayerBullet', '4', { x: this.x, y: this.y-6, offset:  4 }) });
            this.queue.push(() => { this.pool.free('PlayerBullet', '4', { x: this.x, y: this.y-6, offset: -4 }) });
            this.queue.push(() => { this.pool.free('PlayerBullet', '4', { x: this.x+7, y: this.y-4, angle: 1.0472, rotation: 2.0944,}) });
            this.queue.push(() => { this.pool.free('PlayerBullet', '4', { x: this.x-7, y: this.y-4, angle: 2.0944, rotation: 1.0472,}) });
            // Sound
            this.sfxFlags.pShot = true;
            // Reset timer
            this.timers[0] = 0;
        }
        // Shot timer always counting up
        this.timerCount(6);
    }
    updatePos() {
        // Start from no-movement
        this.xDir = 0; this.yDir = 0;
        // Un-press button if out of bounds
        if (this.hitbox[2] <= 0) this.buttons[0] = 0;
        if (this.hitbox[1] >= this.displayWidth) this.buttons[1] = 0;
        if (this.hitbox[3] >= this.displayHeight) this.buttons[2] = 0;
        if (this.hitbox[0] <= 0) this.buttons[3] = 0;
        // Set direction based on pressed buttons
        if (this.buttons[0]) this.yDir++
        if (this.buttons[1]) this.xDir++
        if (this.buttons[2]) this.yDir--
        if (this.buttons[3]) this.xDir--
        // Set correct vector amplitude
        this.vectorAmp = this.setVectorAmplitude(); // 1 or 0.707
        // Update position using parent vector movement
        // this.vectorMovement({
        //     xAng: this.xDir * this.vectorAmp,
        //     yAng: this.yDir * this.vectorAmp
        // })
        // Update position from here
        this.x += (this.xDir * this.vectorAmp) * this.speed;
        this.y -= (this.yDir * this.vectorAmp) * this.speed;
    }
    setVectorAmplitude() {
        // If diagonals then return 0.707, if not return 1
        return this.buttons[0] && this.buttons[1] ||
            this.buttons[1] && this.buttons[2] ||
            this.buttons[2] && this.buttons[3] ||
            this.buttons[3] && this.buttons[0] ? .707 : 1;
    }
    fixOutOfBounds() {
        if (this.hitbox[2] < 0) this.y = this.yMargin - this.yOffset;
        if (this.hitbox[1] > this.displayWidth) this.x = this.displayWidth - this.xMargin - this.xOffset;
        if (this.hitbox[3] > this.displayHeight) this.y = this.displayHeight - this.yMargin - this.yOffset;
        if (this.hitbox[0] < 0) this.x = this.xMargin - this.xOffset;
    }
    positionFar() {
        this.x = this.displayWidth / 2;
        this.y = this.displayHeight + 99;
    }
}

// SHARE MOVEMENT
class PlayerBullet extends Entity {
    constructor(image) {
        super(image);
        this.setupHitbox();
        this.speed = 6;
        this.deadBound = 'top';
    }
    reset1(custom) {
        this.x = custom.x + (custom.offset || 0);
        this.y = custom.y;
        this.rotation = (custom.rotation + 1.5708) || 0;
        // By default they move up
        this.angle = custom.angle || 1.5708;
    }
    updateData() {
        // Destroy if out of the top
        if (this.y <= 0) this.hp = 0;
    }
    updatePos() {this.vectorMovement()};
}

//////////////////////////
// ENEMIES
//////////////////////////

class Enemy extends Entity {
    constructor(image) {
        super(image)
        this.explosionData = function() {return {qty: 9, options: {x:this.x, y:this.y}}};
        // Taken from global: Used for Enemy and EnemyBullet to follow player
        // NOTE: NO sirve llamar a X y a Y individualmente. Hay que tener acceso
        // al objeto entero para que no se haga shallow copy de sus propiedades.
        this.player = pool.type.Player[0];
        // Taken from global: For accurate movement of land enemies by using bg's speed
        this.stage = stage;
    }
    reset1(custom) {
        this.x = custom?.x || this.displayWidth / 2;
        this.y = custom?.y || -this.height / 2;
        this.side = custom?.side || 1;
        this.phase = custom?.phase || 1;
        this.speed = custom?.speed || 1;
    }
    shot(howMany = 1, spd, angle, add, offX = 0, offY = 0) {
        // Reduce layer name
        for(let i = 0; i < howMany; i++)
            this.pool.free('EnemyBullet', '6', 
                {x: this.x + offX, 
                y: this.y + offY, 
                speed: spd, 
                // This angle parameter can be the string 'toPlayer'
                angle: angle || 270 + i * (360 / howMany),
                // Multiply add to spread, if any
                add: add * (i - M.floor(howMany/2)) || 0,
            });
            // Sound
            this.sfxFlags.eShot = true;
    }
    // Reduce all moving functions that are not used
    easeOutCubic(xy, startPos, goTo, timeInFrames, timerUsed = 0) {
        this[xy] = (goTo - startPos) * (1 - M.pow(1 - this.timers[timerUsed] / timeInFrames, 3)) + startPos;
    }
    easeInOutSine(xy, startPos, goTo, timeInFrames, timerUsed = 0) {
        this[xy] = (goTo - startPos) * (-(M.cos(M.PI * this.timers[timerUsed] / timeInFrames) - 1) / 2) + startPos;
    }
    sin(xy, halfCycle, freq, centerPoint, timerUsed = 0) {
        this[xy] = halfCycle * M.sin(this.timers[timerUsed] / 32 * freq) + centerPoint;
    }
    cos(xy, phase, cycle, freq, centerPoint, timerUsed = 0) {
        this[xy] = cycle / 2 * phase * M.cos(this.timers[timerUsed] / 32 * freq) + centerPoint;
    }
}
class EnemyBullet extends Enemy {
    constructor(image) {
        super(image);
        this.setupHitbox(1, 1);
        this.explosionData = () => false;
        this.deadBound = 'any';
    }
    reset2(custom) {
        // Check between mode 'auto' (towards Player) and regular degrees
        if (custom?.angle === 'auto') {
            this.angle = M.atan2(this.y - this.player.y, this.player.x - this.x);
        } else {
            this.angle = this.math.toRadians(custom?.angle || 0);
        }
        // Add spread if any
        this.angle += this.math.toRadians(custom?.add) || 0;
    }
    updateData() {
        this.rotation += this.math.toRadians(9)
        // Destroy if out of bounds
        if (this.x <= 0 - this.width / 2) return this.hp = 0;
        if (this.x >= this.displayWidth + this.width / 2) return this.hp = 0;
        if (this.y <= 0 - this.height / 2) return this.hp = 0;
        if (this.y >= this.displayHeight + this.height / 2) return this.hp = 0;
    }
    updatePos() {this.vectorMovement()};
}
class SinePop extends Enemy {
    constructor(image) {
        super(image)
        this.setupHitbox(this.height/2,this.height/2-1,0,-1);
        this.deadBound = 'bottom';
    }
    updatePos() {
        // Cosine movement
        this.cos('x', this.phase, 130, 1, 80);
        this.timerCount();
        this.y += 0.5
    }
}
// MAYBE CAN SHARE MOVEMENT
class Sniper extends Enemy {
    constructor(image) {
        super(image)
        this.setupHitbox(this.width/2-1, this.height/2-1);
        this.deadBound = 'bottom';
    }
    reset2(){
        this.hp = 3;
        this.speed = 1.5;
    }
    updateData() {
        this.timerCount(100);
        if (this.timers[0] < 50) this.speed -= .025;
        if (this.timers[0] === 60) this.shot(1, 1, 'auto', 0, -1, 4);
        if (this.timers[0] === 100) this.speed += .02;
    }
    updatePos() {
        // Go down adding (variable) speed
        this.y += this.speed;
    }
}
class Fatty extends Enemy {
    constructor(image) {
        super(image)
        this.setupHitbox(5, 5);
    }
    reset2(custom) {
        this.hp = 4;
        // Set x starting position based on side
        this.x = this.displayWidth / 2 - (this.displayWidth / 2 + this.width/2) * this.side;
        // And y aproximately around here
        this.y = 10;
        // Set this.deadBound based on this.side
        this.deadBound = custom?.side === 1 ? 'right' : 'left';
    }
    updateData() {
        this.timerCount(300);
        if (this.timers[0] === 80) this.shot(3, 1.3, 'auto', 20);
    }
    updatePos() {
        // Go down adding (variable) speed
        this.x += (this.speed * .75) * this.side;
        this.y += (this.speed * .25);
    }
}
class Tank extends Enemy {
    constructor(image) {
        super(image)
        this.setupHitbox(this.width / 2, this.height / 2-2);
        this.deadBound = 'bottom';
    }
    reset2(){
        this.hp = 3;
    }
    updatePos() {
        // Go down at the speed of background
        this.y += (this.stage.bg.speed + .1);
    }
}
class Assaulter extends Enemy {
    constructor(image) {
        super(image)
        this.setupHitbox(10, 10);
        this.deadBound = 'any';
        this.delayedFree = true;
    }
    reset2() {
        this.hp = 22;
        this.speed = 2.5;
        this.angle = M.atan2(this.y - this.player.y, this.player.x - this.x);
        this.scale = 1.5;
    }
    updateData() {
        this.timerCount(100);
        if (this.timers[0] < 25)    this.speed -= .1;
        if (this.timers[0] === 40)  this.shot(10, 1);
        if (this.timers[0] === 80)  this.angle = M.atan2(this.y - this.player.y, this.player.x - this.x);
        if (this.timers[0] > 80)    this.speed += .02;
        if (this.timers[0] === 99)  this.shot(3, 1.5, 'auto', 20);
    }
    updatePos() {this.vectorMovement()}
}

//////////////////////////
// PARTICLES
//////////////////////////

// Particles doesn't have a hitbox
class Particle extends Entity {
    constructor(image) {
        super(image)
    }
    reset1(custom) {
        this.x = custom?.x;
        this.y = custom?.y;
        this.scale = 4;
        this.speed = custom?.speed || 3;
        this.subSpdRange = custom?.subSpdRange || [1, 2];
        // Set random direction:
        this.angle = this.math.toRadians(this.math.randomBetween(1, 360));
        // Randomize rotation direction
        this.rndDir = this.math.randomBetween(0,1)?-1:1;
        // Random color
        this.colors = custom?.colors || ['#f61','#fd7','#ff9','#feb','#ffc','#ffe'];
        this.rndColor = this.colors[this.math.randomBetween(0,this.colors.length-1)];
    }
    updateData() {
        // this.scale-=this.math.randomBetween(1,2);
        this.scale-=.2;
        this.opacity-= 5;
        this.rotation += .08 * this.rndDir; // 5 degree in a random orientation
        this.speed -= this.math.randomBetween(...this.subSpdRange) / 10
        // If invisible, bye
        if (this.scale <= 0) this.hp = 0;
    }
    updatePos() {this.vectorMovement()}
}
