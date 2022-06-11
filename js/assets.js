//////////////////////////
// ASSETS
//////////////////////////

class Assets {
	constructor(dir, imageScaled) {
		// PNGs need to be scaled by 9x minimum and optimized with tinypng.com
		this._imageScaled = imageScaled;
		this._dir = dir;
		this._filenames = {
			Stage1: 'stage-1.png',
			Player: 'player.png',
			PlayerBullet: 'pBullet.png',
			EnemyPop1: 'enemy.png',
			Tank: 'tank1.png'
		}
		this.loadPatterns();
	}

	loadPatterns(){
		this.patterns = {};
		this.patterns[1] = 
		[1,1,1,1,1,1,1,1,1,1,2,3,4,5,6,1,1,1,2,7,1,1,1,1,8,9,10,1,1,11,3,12,13,13,14,1,1,1,15,16,1,1,1,17,18,18,18,19,11,3,12,20,18,18,18,1,1,1,21,22,23,1,1,1,1,24,25,26,27,28,29,18,1,1,1,1,1,1,30,31,32,33,1,1,1,34,25,21,22,22,14,1,1,1,1,1,1,1,35,36,37,38,1,1,1,18,18,39,31,40,41,25,42,1,1,1,1,1,1,1,43,1,1,1,1,1,1,35,36,44,45,18,46,1,1,1,1,1,1,1,47,48,1,1,1,1,1,1,1,1,1,1,49,1,1,1,1,1,1,1,50,51,1,1,1,1,1,1,1,1,1,1,52,1,1,1,1,1,1,1,53,51,1,1,1,1,1,1,1,1,1,1,52,1,1,1,1,1,1,1,13,14,1,1,1,1,1,1,1,1,1,1,52,1,1,1,1,1,1,1,40,54,1,1,1,1,1,1,1,1,1,1,52,1,1,1,1,1,1,1,44,55,1,1,1,1,1,1,1,1,1,1,52,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,56,57,52,57,57,58,1,1,8,9,1,1,1,1,1,1,1,1,1,1,59,60,61,7,48,62,1,17,18,18,1,1,1,1,1,1,1,1,1,1,59,63,64,65,51,62,1,1,1,1,1,1,1,66,1,1,1,1,67,1,59,68,69,70,29,71,58,1,1,1,1,1,17,18,19,1,1,1,1,56,72,68,69,70,73,74,62,1,1,1,1,1,1,1,1,1,1,1,1,59,11,53,69,5,53,29,62,1,1,1,1,1,1,1,1,1,1,1,1,59,68,53,75,53,76,29,71,58,67,1,1,1,1,1,1,1,66,1,56,72,68,53,75,73,53,53,74,62,1,1,1,1,1,1,1,17,18,19,59,11,53,53,4,65,53,53,29,62,1,1,1,1,1,1,1,1,1,56,72,68,77,53,53,75,53,53,29,62,1,1,1,1,1,1,1,1,1,59,11,53,53,53,64,70,53,53,29,71,58,1,1,1,66,1,1,1,56,72,68,53,53,53,69,70,53,53,53,74,62,1,1,17,18,19,1,56,72,11,53,53,53,53,69,70,53,77,53,29,62,1,1,1,1,1,56,72,11,53,53,53,53,53,69,70,53,53,53,29,71,58,1,1,1,56,72,11,53,53,53,53,53,53,69,78,65,53,53,53,74,62,1,1,1,59,11,53,76,53,53,53,53,53,4,78,70,53,53,77,29,62,1,1,56,72,68,53,53,53,53,53,76,53,53,69,70,53,53,53,29,62,1,1,59,11,53,53,53,53,53,53,53,53,53,69,78,65,53,53,29,62,1,56,72,68,53,53,53,53,53,53,53,53,64,78,78,70,53,53,29,62,1,59,68,28,53,53,53,53,77,53,53,53,64,78,79,70,53,53,29,62,59,11,80,81,82,83,53,53,53,53,53,64,78,78,78,5,53,53,29,62,59,68,84,85,32,86,53,53,53,64,87,78,78,78,5,88,53,53,29,62,11,3,89,90,91,92,53,53,64,78,78,78,78,5,53,53,53,53,29,62,68,53,53,93,94,53,64,87,78,79,78,78,5,53,53,53,53,12,20,62,68,53,53,53,53,64,78,78,78,79,78,5,53,73,53,53,12,20,62,1,68,53,53,64,87,78,78,78,78,95,5,53,53,53,53,53,29,62,1,1,96,50,53,4,78,78,78,78,5,53,53,53,53,53,53,53,29,62,1,1,59,96,50,53,69,79,78,70,53,53,76,53,53,28,53,53,29,62,1,1,1,59,68,53,4,95,78,78,65,53,53,53,53,53,53,53,29,62,1,1,1,59,68,53,53,53,4,78,78,65,53,53,73,53,53,53,97,74,62,1,59,11,53,53,53,53,53,4,78,78,87,87,65,53,53,53,53,97,74,62,59,68,98,99,53,53,53,53,4,95,78,79,78,65,53,88,53,53,29,62,59,68,53,53,53,53,53,28,53,53,4,78,78,70,53,53,53,53,29,62,59,96,50,53,53,53,53,53,53,53,53,4,78,78,65,53,73,53,29,62,1,59,68,53,53,53,53,53,53,53,53,53,69,78,78,65,53,88,29,62];
	}
	loadImagesAnd(runSetupFn) {
		// Get number of remaining images to be loaded
		let remaining = Object.keys(this._filenames).length;

		loopOver(this._filenames, (key, file) => {
			// Create a new property for each image
			this[key] = new Image();
			this[key].src = this._dir + file;

			this[key].addEventListener('load', () => {
				// Scale down to intended size once loaded
				this[key].width  /= this._imageScaled;
				this[key].height /= this._imageScaled;
				remaining--;
				// If all images have loaded...
				if(remaining === 0) runSetupFn();
			});
		});
		return this;
	}
	getRawPattern(stageNum){
		return this.patterns[stageNum];
	}
	getPoolInputArr(stageNum){
        if (stageNum === 1)
		return [
			[12, PlayerBullet],
			[5, EnemyPop1],
			[3, Tank],
		];

        if (stageNum === 2)
		return [
			[],
			// Etc...
		];
	}
	getEventsFn(stageNum) {
        if (stageNum === 1) return function(iteration){
			if (iteration === 50)   this.pool.getFreeObject('EnemyPop1', 'EnemyAir', {phase:-1});
			if (iteration === 80)   this.pool.getFreeObject('EnemyPop1', 'EnemyAir', {phase:-1});
            if (iteration === 145)  this.pool.getFreeObject('Tank', 'EnemyLand', {x:95});
			if (iteration === 225)  this.pool.getFreeObject('Tank', 'EnemyLand', {x:200});
            // if (iteration === 200)   this.bg.speed += 1;
			if (iteration === 400)  this.pool.getFreeObject('EnemyPop1', 'EnemyAir', {phase:1});
			if (iteration === 430)  this.pool.getFreeObject('EnemyPop1', 'EnemyAir', {phase:1});
			if (iteration === 460)  this.pool.getFreeObject('EnemyPop1', 'EnemyAir', {phase:1});
			if (iteration === 490)  this.pool.getFreeObject('EnemyPop1', 'EnemyAir', {phase:1});
            if (iteration === 550)  this.bg.queue.push(...this.patterns['2'], ...this.patterns['3']);
			if (iteration === 660)  this.pool.getFreeObject('Tank', 'EnemyLand', {x:95});
			if (iteration === 880)  this.pool.getFreeObject('Tank', 'EnemyLand', {x:208});

			if (iteration === 1200)  this.bg.speed += 0.25;
			if (iteration === 1250)  this.bg.speed += 0.25;
			if (iteration === 1300)  this.bg.speed += 0.25;
			if (iteration === 1350)  this.bg.speed += 0.25;
			if (iteration === 1400)  this.bg.speed += 0.25;
			if (iteration === 1450)  this.bg.speed += 0.25;
        };z
        if (stageNum === 2) return function(iteration){
            // Events here...
        };
    }
	deleteUnused(){
		delete this._dir;
		delete this._imageScaled
		delete this._filenames
	}
};