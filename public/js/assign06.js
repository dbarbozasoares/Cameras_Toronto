document.addEventListener("DOMContentLoaded", function () {
  const baseUrl = (window.location.hostname === 'cameras-toronto.vercel.app') // make sure we can access end point from vercel
    ? 'https://cameras-toronto.vercel.app/api/data/' 
    : 'http://localhost:3000/api/data/';

  var results = document.querySelector(".results");
  var typeDropDown = document.getElementById("typeofsearch");
  var searchArea = document.querySelector(".search");
  var areasDrop = document.getElementById("areas-option");
  var counter = 0; // count how many cameras
  var data; // json received from API

  typeDropDown.addEventListener("change", function (event) {
    let url;
    const selectedValue = event.target.value;
  
    // Construct the URL based on selected value
    if (selectedValue === "Constructions") {
      url = `${baseUrl}constructionprojects`;
    } else if (selectedValue === "Cameras") {
      url = `${baseUrl}cameras`;
    }
  
    // Only fetch if a URL was created
    if (url) {
      fetch(url, {
        method: "GET",
        mode: 'no-cors',
      })
      .then((response) => {
        // Check if response is OK
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json(); // Parse the JSON
      })
      .then((json) => {
        console.log(json);
        data = json;
        // Handle the JSON data here
        // For example, you can display results or populate a dropdown
        appendOption(data);
      })
      .catch((error) => {
        console.error('There has been a problem with your fetch operation:', error);
      });
    }
  });

  function appendOption(data) {
    console.log("Calling append option", data);
    const areas = document.getElementById("areas-option");
    const type = typeDropDown.value;

    if (type === "Cameras") {
      areasDrop.textContent = "";
      areasDrop.selectedIndex = 0;
      for (let i = 0; i < data.length; i++) {
        if (i === 0) {
          const allAreasPara = document.createElement("option");
          allAreasPara.textContent = "-- Select Area --";
          areas.appendChild(allAreasPara);
        }
        let validator = true;
        for (let j = i + 1; j < data.length; j++) {
          const roadI = data[i].Roadway.replace(/-/g, "");
          const roadJ = data[j].Roadway.replace(/-/g, "");

          if (roadI.replace(/\s/g, "") === roadJ.replace(/\s/g, "")) {
            validator = false;
            break;
          }
        }
        if (validator && data[i].Views[0].Status === "Enabled") {
          const option = document.createElement("option");
          option.value = data[i].Roadway;
          option.textContent = data[i].Roadway;
          areas.appendChild(option);
        }
      }
    } else if (type === "Constructions") {
      areasDrop.textContent = "";
      areasDrop.selectedIndex = 0;
      document.querySelector(".results-header").innerHTML = "";
      document.querySelector(".results").innerHTML = "";
      for (let i = 0; i < data.length; i++) {
        if (i === 0) {
          const allAreasPara = document.createElement("option");
          allAreasPara.textContent = "-- Select Area --";
          areas.appendChild(allAreasPara);
        }
        let validator = true;
        for (let j = i + 1; j < data.length; j++) {
          const roadI = data[i].RoadwayName.replace(/-/, "");
          const roadJ = data[j].RoadwayName.replace(/-/, "");
          if (roadI === roadJ || roadI === "40") {
            validator = false;
            break;
          }
        }
        if (validator) {
          const option = document.createElement("option");
          if (
            data[i].RoadwayName.length === 2 ||
            data[i].RoadwayName.length === 3 ||
            !isNaN(data[i].Roadway)
          ) {
            option.value = `Highway ${data[i].RoadwayName}`;
            option.textContent = `Highway ${data[i].RoadwayName}`;
          } else {
            option.value = data[i].RoadwayName;
            option.textContent = data[i].RoadwayName;
          }
          areas.appendChild(option);
        }
      }
    }
  }

  document.getElementById("submit").addEventListener("click", fetchResults);
  document.getElementById("submit").addEventListener("click", clearBoxes);

  function clearBoxes() {
    searchArea.value = "";
  }

  function fetchResults() {
    areasDrop.selectedIndex = 0;
    const areaTyped = searchArea.value;
    const optChosen = typeDropDown.value;
    counter = 0;
    results.innerHTML = "";

    for (let i = 0; i < data.length; i++) {
      if (
        optChosen === "Cameras" &&
        data[i].Views[0].Status === "Enabled" &&
        data[i].Roadway.toLowerCase().includes(areaTyped.toLowerCase()) &&
        areaTyped !== ""
      ) {
        console.log(data[i].Views[0].Description);
        const allCards = document.createElement("div");
        allCards.classList.add("allCards");
        counter++;
        let cardBox = document.createElement("div");
        let arrayImages = data[i].Views;
        const card = document.createElement("div");
        card.classList.add("card");

        const descriptionHeader = document.createElement("h2");
        descriptionHeader.classList.add("header-camera");
        descriptionHeader.textContent = `${data[i].Roadway} - ${data[i].Views[0].Description}`;

        card.appendChild(descriptionHeader);

        arrayImages.forEach((image) => {
          const imageRoad = document.createElement("img");
          imageRoad.src = image.Url;
          card.appendChild(imageRoad);
          cardBox.appendChild(card);
        });

        allCards.appendChild(cardBox);
        results.appendChild(allCards);
        searchArea.value = "";
      } else if (
        optChosen === "Constructions" &&
        (data[i].RoadwayName.toLowerCase().includes(areaTyped.toLowerCase()) ||
          data[i].Description.toLowerCase().includes(areaTyped.toLowerCase())) &&
        areaTyped !== "" &&
        (data[i].Description !== data[i + 1]?.Description ||
          data[i].Description.toLowerCase().includes(areaTyped.toLowerCase()))
      ) {
        console.log(data[i]);
        const allCardsConstruction = document.createElement("div");
        allCardsConstruction.classList.add("allCardsConstruction");
        counter++;
        const cardBox = document.createElement("div");
        cardBox.classList.add("card-box");

        const construction_card = document.createElement("div");
        construction_card.classList.add("construction-card");

        const descriptionHeader = document.createElement("h2");
        descriptionHeader.classList.add("header-construction");
        descriptionHeader.textContent = data[i].Roadway;

        let direction = document.createElement("p");
        direction.classList.add("direction-construction");
        direction.textContent = `Direction: ${data[i].DirectionOfTravel}`;
        descriptionHeader.appendChild(direction);

        construction_card.appendChild(descriptionHeader);

        let date = document.createElement("p");
        date.classList.add("date-construction");
        date.textContent = `Date: ${data[i].Comment}`;
        construction_card.appendChild(date);

        let descrip = document.createElement("p");
        descrip.classList.add("descript-construction");
        descrip.innerHTML = data[i].Description.replace(
          new RegExp("\\d+\\s*minutes|" + areaTyped, "gi"),
          (match) => {
            if (match.toLowerCase().includes("minutes")) {
              return `<span style="background-color: yellow; font-weight: bolder">${match}</span>`;
            } else {
              return `<span style="font-weight: bolder">${match}</span>`;
            }
          }
        );

        construction_card.appendChild(descrip);

        allCardsConstruction.appendChild(construction_card);
        results.appendChild(allCardsConstruction);
        searchArea.value = "";
      }
    }
    printNoCameraMessage(counter);
  }

  function printNoCameraMessage(counter) {
    document.querySelector(".results-header").innerHTML = "";
    let para = document.createElement("h2");
    para.style.color = "Black";
    para.style.width = "700px";
    para.style.textAlign = "Center";
    para.style.borderRadius = "10%";
    para.style.fontSize = "25px";
    if (counter > 0) {
      para.textContent = `Displaying all information found ... (${counter}) found`;
      para.style.textAlign = "Center";
    } else {
      para.textContent = "NO DATA AVAILABLE";
      para.style.backgroundColor = "ORANGE";
    }
    document.querySelector(".results-header").appendChild(para);
  }

  areasDrop.addEventListener("change", displayDataFromDrop);

  function displayDataFromDrop() {
    
    const optChosen = typeDropDown.value;
    let areas = areasDrop.value;
    counter = 0;
    areas = areas.replace(/-/g, "");
    results.innerHTML = "";
    document.querySelector(".results-header").innerHTML = "";
    for (let i = 0; i < data.length; i++) {
      const roadWayUpdated = (data[i].Roadway || data[i].RoadwayName).replace(/-/g, "");
      const allCards = document.createElement("div");
      allCards.classList.add("allCards");
      const roadWayNoDash = roadWayUpdated;
      
      if (
        optChosen === "Cameras" &&
        data[i].Views[0].Status === "Enabled" &&
        roadWayNoDash.includes(areas)
      ) {
        let cardBox = document.createElement("div");
        counter++;
        let arrayImages = data[i].Views;
        const card = document.createElement("div");
        card.classList.add("card");

        const descriptionHeader = document.createElement("h2");
        descriptionHeader.classList.add("header-camera");
        descriptionHeader.textContent = `${data[i].Roadway} - ${data[i].Views[0].Description}`;

        card.appendChild(descriptionHeader);

        arrayImages.forEach((image) => {
          const imageRoad = document.createElement("img");
          imageRoad.src = image.Url;
          card.appendChild(imageRoad);
          cardBox.appendChild(card);
        });

        allCards.appendChild(cardBox);
        results.appendChild(allCards);
      } else if (optChosen === "Constructions" && roadWayNoDash.includes(areas)) {
        const allCardsConstruction = document.createElement("div");
        allCardsConstruction.classList.add("allCardsConstruction");
        counter++;
        const cardBox = document.createElement("div");
        cardBox.classList.add("card-box");

        const construction_card = document.createElement("div");
        construction_card.classList.add("construction-card");

        const descriptionHeader = document.createElement("h2");
        descriptionHeader.classList.add("header-construction");
        descriptionHeader.textContent = data[i].Roadway;

        let direction = document.createElement("p");
        direction.classList.add("direction-construction");
        direction.textContent = `Direction: ${data[i].DirectionOfTravel}`;
        descriptionHeader.appendChild(direction);

        construction_card.appendChild(descriptionHeader);

        let date = document.createElement("p");
        date.classList.add("date-construction");
        date.textContent = `Date: ${data[i].Comment}`;
        construction_card.appendChild(date);

        let descrip = document.createElement("p");
        descrip.classList.add("descript-construction");
        descrip.innerHTML = data[i].Description.replace(
          new RegExp("\\d+\\s*minutes|", "gi"),
          (match) => {
            return `<span style="background-color: yellow; font-weight: bolder">${match}</span>`;
          }
        );
        construction_card.appendChild(descrip);

        allCardsConstruction.appendChild(construction_card);
        results.appendChild(allCardsConstruction);
        searchArea.value = "";
      }
    }
    printNoCameraMessage(counter);
  }
});
