
// Global game variable
let game = null;
let message="placeholder";

function Cell(){
    let value = null; //initialise value to nothing

    function getValue(){
        return value;
    }

    function setValue(newValue){
        if(value===null){//if the value in the cell is empty
            value= newValue; //change the value(player select)
        } 
    }
    return {getValue, setValue} //return the methods to get value and set new values for use in the game (player selcets x or o on empty sells)

};


function playerFactory(name1, name2){
    console.log("🧪 playerFactory received:", name1, name2);
    const Player = (name, marker) => {
        return { name, marker };
      };

const player1 = Player(name1 || "Player 1", "X");
const player2 = Player(name2 ||"Player 2", "O");

return {player1, player2};

};

//gameboard GRID and Gameflow controller

function GameFactory(players){
    const rows = 3;
    const columns = 3;
    const board = [];
    
    let currentPlayerIndex = 0; //player turn


    //Create the board 3 across, 3 down
    for (let i = 0; i<rows; i++){
        board[i]=[];
        for(let j = 0; j<columns;j++)
            board[i].push(Cell());
    }

    function getBoard(){
        return board;
    }

    function checkWin(marker){
        const winCombinations = [
            //check rows across first number is [row] THEN second is [col]
            [[0,0],[0,1],[0,2]], //top row
            [[1,0],[1,1],[1,2]], //second row
            [[2,0],[2,1],[2,2]], //third row

            //check columns down
            [[0,0],[1,0],[2,0]], //left column
            [[0,1],[1,1],[1,2]], // middle column
            [[0,2],[1,2],[2,2]], //right column

            //diagonals
            [[0,0],[1,1],[2,2]], //top left-bottow right
            [[0,2],[1,1],[2,0]], //rop right-bottow left
        ];

        return winCombinations.some(combination => { //.some method checks for full lines
            return combination.every(([row, col]) => board[row][col].getValue() === marker); //.every checks for same marker
        });
    }

    
    function reset(){
      // Clear the board array completely
    for (let i = 0; i < rows; i++) {
        board[i] = []; // Reset each row
        for (let j = 0; j < columns; j++) {
            board[i].push(Cell()); // Reinitialize fresh cells
        }
    }
    currentPlayerIndex = 0;
    displayBoard(game); // Force UI update
    console.log("✅ Board fully reset"); // Debug log
       
    }
    

   




function playerSelect (row, column){
    console.log("🔸 playerSelect start — currentPlayerIndex =", currentPlayerIndex);
    const cell = board[row][column];

    
    if (cell.getValue()!==null){ //check if cell is empty
        return 'Cell is already occupied';
    }

    const currentPlayer = players[currentPlayerIndex];
    cell.setValue(currentPlayer.marker);
    console.log("Current player marker:", currentPlayer.marker);
    

    if (checkWin(currentPlayer.marker)){
        console.log("win triggered");
        alert(`${currentPlayer.name} wins`)

        return `${currentPlayer.name} wins!`;
        

    }

     // 4) Check for a draw (board full & no winner)
    if (board.flat().every(c => c.getValue() !== null)) {
        console.log("draw triggered");
    return "It's a draw!";
    }

        // Switch to the next player
    currentPlayerIndex = (currentPlayerIndex + 1) % 2;  // Toggle between 0 and 1
    console.log("🔸 switched — new currentPlayerIndex =", currentPlayerIndex);
    return `${currentPlayer.name} placed ${currentPlayer.marker} at [${row}, ${column}]`;
    }


    

return { getBoard, playerSelect, checkWin, reset, startGame };  // Expose functions to interact with the game
};


function startGame(){
    const player1 = document.getElementById('player1').value;
    const player2 = document.getElementById('player2').value;

    console.log("🎮 Names from input:", player1, player2);

    const players = playerFactory(player1, player2);

    console.log("Players:", players);
   
     game = GameFactory([players.player1, players.player2]);
    displayBoard(game);
    console.log("Game started:", player1, player2);




};

function displayBoard(game){
    const gameContainer = document.getElementById("gameUI-container"); // get element in html where game board will be displayed
    gameContainer.innerHTML=""; //Clear previous board 
    const messageContainer = document.getElementById("message-container");
    //messageContainer.innerHTML =""; //clear previous message

    const board = game.getBoard(); // call function to retrieve board and set it to const board
    board.forEach((row, rowIndex) =>{ //this loops over each row (0,1 and 2) 
        row.forEach((cell, colIndex) => {
            const cellDiv=document.createElement("div"); //create div in html to show this cell
            cellDiv.classList.add("cell"); //adds a class to the div above for CSS styling .cell class
            const value = cell.getValue();
            cellDiv.textContent = value ? value : "-"; //set cell content if its used x/o or empty -

              // Add click handler
              cellDiv.addEventListener("click", () => {
                const message = "The player selected: "+ game.playerSelect(rowIndex, colIndex);
                console.log(game.getBoard().map(row => row.map(cell => cell.getValue())));
                displayBoard(game); // Re-render after move
                updateMessage(message); // Show game status
                const messageContainer = document.getElementById('message-container');
                messageContainer.textContent = message;
            
            });

            gameContainer.appendChild(cellDiv); //append to gameContainer


        });
        
    });


};

function updateMessage(message) {
    const messageContainer = document.getElementById('message-container');
    messageContainer.textContent = message; // Simply update the text content of the message container
}




//LISTENERS
document.getElementById("reset-button").addEventListener("click", () => {
    game.reset();
    displayBoard(game);
});

document.getElementById('start').addEventListener('click', startGame);

// Display the board to see the current state of the game

function printBoard(board) {
    board.forEach(row => {
      console.log(row.map(cell => cell.getValue() || "-").join(" | "));
    });
    console.log("-----------");
  }



