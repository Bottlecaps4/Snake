$(document).ready(function(){
	//Set Global variables
    const canvas = $("#canvas")[0],
        ctx = canvas.getContext("2d"),
        w = $("#canvas").width(),
        h = $("#canvas").height(),
        cw = ch = 10; // ch = cell-height, cw = cell-width

     let snake,
         food,
         d, 
		 score;
    
    // Initialize game
	function initialize(){
        d = "right";
		score = 0;
		createSnake();
		createFood(); 
        
        // use a time loop to move the snake based on the 'drawGame' function
		if(typeof game_loop !== "undefined") clearInterval(game_loop);
		game_loop = setInterval(drawGame, 80);
	}
	initialize();
    
    // Create the snake
	function createSnake(){
		var length = 5; //Length of the snake
		snake = []; 
		for(var i = length-1; i>=0; i--){
			snake.push({x: i, y:0});
		}
	};
    
    // Create the food
	function createFood(){
		food = {
			x: Math.round(Math.random()*(w-cw)/cw), 
			y: Math.round(Math.random()*(h-ch)/ch), 
		};
    };
    
    // Paint the Snake 
    function paintSnake(x, y){
        ctx.fillStyle = "#262626";
		ctx.fillRect(x*cw, y*ch, cw, ch);
		ctx.strokeStyle = "rgb(204, 214, 177)";
		ctx.strokeRect(x*cw, y*ch, cw, ch);
    };

    // Paint the food 
    function paintFood(x, y){
        ctx.fillStyle = "rgb(82, 64, 68)";
		ctx.fillRect(x*cw, y*ch, cw, ch);
		ctx.strokeStyle = "rgb(204, 214, 177)";
		ctx.strokeRect(x*cw, y*ch, cw, ch);
    };
	
	function drawGame(){
        
        // paint the background after each reload of snake position
		ctx.fillStyle = "rgb(204, 214, 177)";
		ctx.fillRect(0, 0, w, h);
		ctx.strokeStyle = "black";
		ctx.strokeRect(0, 0, w, h);
        
        // Head of snake in X-Y co-ordiantes
		var nx = snake[0].x;
		var ny = snake[0].y;
        
        // Add a new head position based on arrow keys
		if(d === "right") nx++;
		else if(d === "left") nx--;
		else if(d === "up") ny--;
		else if(d === "down") ny++;
        
        // End game if snake collides with edge of canvas or itself
		if(nx === -1 || nx === w/cw || ny === -1 || ny === h/cw || checkCollision(nx, ny, snake)){
			initialize();
			return;
		};
        
        // Make snake 'eat' food
		if(nx === food.x && ny === food.y){
            // food becomes head of snake
			var tail = {x: nx, y: ny};
			score += 10;
			createFood();
		} else{
            // otherwise tail becomes head (length stays the same)
			var tail = snake.pop(); 
			tail.x = nx; tail.y = ny;
		}
		
		snake.unshift(tail); //puts back the tail as the first cell
        
        // Paint the snake 'array'
		for(var i = 0; i < snake.length; i++){
			var c = snake[i];
			paintSnake(c.x, c.y);
		}
		
		// Generate a food each time it's eaten
		paintFood(food.x, food.y);
        
        // Add the score to screen
		$('#score').html("Score: " + score);
    };
    
    // Event listener for arrow keys to move snake
    $(document).keydown(function(event){
		var key = event.which;
		if (key === 37 && d !== "right"){
            d = "left";
        } else if (key === 38 && d !== "down"){
            d = "up";
        } else if (key === 39 && d !== "left"){
            d = "right";
        } else if (key === 40 && d !== "up"){
            d = "down";
        }
	});
	
	// Event listener for click of on-screen number pad
	$('button').click(function(){
		var key = $(this);
		if(key.hasClass("upkey") && d !== "down"){
			d = "up";
		} else if (key.hasClass("downkey") && d !== "up"){
			d = "down";
		} else if (key.hasClass("leftkey") && d !== "right"){
			d = "left";
		} else if (key.hasClass("rightkey") && d !== "left"){
			d = "right";
		}
	});
    
    // Condition if snake 'eats' itself
	function checkCollision(x, y, array){
		for(var i = 0; i < array.length; i++){
			if(array[i].x === x && array[i].y === y){
				return true;
			}
		}
		return false;
	};
	
})