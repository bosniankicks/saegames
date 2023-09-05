document.addEventListener("DOMContentLoaded", () => {
    let currentTab = "Cup Pong";
    const pageTitle = document.getElementById("page-title");
    pageTitle.textContent = currentTab;
  
    function fetchPlayers(game) {
      fetch(`https://4536-173-17-233-141.ngrok-free.app/api/getPlayers/${game}`)
        .then(response => response.json())
        .then(players => populatePlayers(players, game));
    }
  
    const tabs = document.querySelectorAll('.tabs li');
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        currentTab = tab.getAttribute('data-tab');
        pageTitle.textContent = currentTab;
        fetchPlayers(currentTab);
      });
    });
  
    const adminBtn = document.getElementById("admin-btn");
    const adminModal = document.getElementById("admin-modal");
    const addPlayerBtn = document.getElementById("add-player-btn");
    const exitAdminBtn = document.getElementById("exit-admin-btn");
    const playerNameInput = document.getElementById("player-name");
  
    adminBtn.addEventListener("click", () => {
      adminModal.style.display = "flex";
    });
  
    exitAdminBtn.addEventListener("click", () => {
      adminModal.style.display = "none";
    });

    addPlayerBtn.addEventListener("click", () => {
      const playerName = playerNameInput.value;
      if (playerName) {
        fetch(`https://4536-173-17-233-141.ngrok-free.app/api/addPlayer/${currentTab}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: playerName, score: 0 })
        })
        .then(response => response.json())
        .then(data => {
          fetchPlayers(currentTab);
          playerNameInput.value = "";
          adminModal.style.display = "none";
        })
        .catch(error => {
          console.error("Error adding player:", error);
        });
      }
    });
    
  
    function populatePlayers(players, tab) {
      const playerContainer = document.querySelector(".player-container");
      playerContainer.innerHTML = "";
      players.forEach(player => {
        const playerElem = createPlayerContainer(player);
        playerContainer.appendChild(playerElem);
      });
    }
  
    function createPlayerContainer(player) {
      const playerContainer = document.createElement("div");
      playerContainer.classList.add("player");
    
      const closeButton = document.createElement("span");
      closeButton.classList.add("close");
      closeButton.textContent = "X";
      closeButton.addEventListener("click", () => {
        fetch(`https://4536-173-17-233-141.ngrok-free.app/api/deletePlayer/${currentTab}/${player.player_id}`, {
          method: 'DELETE'
        })
        .then(response => response.json())
        .then(data => {
          fetchPlayers(currentTab);
        })
        .catch(error => {
          console.error("Error deleting player:", error);
        });
      });
    
  
      const playerName = document.createElement("h2");
      playerName.textContent = player.name;
  
      const playerScore = document.createElement("p");
      playerScore.textContent = `Score: ${player.score}`;
  
      playerContainer.appendChild(closeButton);
      playerContainer.appendChild(playerName);
      playerContainer.appendChild(playerScore);
  
      return playerContainer;
    }
  
    fetchPlayers(currentTab);
  });
  