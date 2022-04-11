"use strict";
const Food = function (category, subIngredients) {
  this.category = category;
  this.subIngredients = [];
  this.subIngredients.push(new Recipes(subIngredients));
};

const Recipes = function (secondIng) {
  this.secondIng = secondIng;
  this.rec = [];
};
Recipes.prototype.addRecipe = function (r) {
  this.rec.push(r);
};
Recipes.prototype.getRec = function () {
  return this.rec;
};
Recipes.prototype.getSecondIng = function () {
  return this.secondIng;
};
Food.prototype.getCat = function () {
  return this.category;
};
Food.prototype.addSecondIng = function (second) {
  this.subIngredients.push(second);
};
Food.prototype.getSunIng = function () {
  return this.subIngredients;
};
const listFood = [];

getData();

async function getData() {
  let start = -1;
  const response = await fetch("MappingTry.csv");
  const mess = await response.text();
  const rows = mess.split("\n").slice(1);
  // console.log(rows);
  rows.forEach((row, i) => {
    const el = row.split(";").splice(0, 3);
    if (el[0] !== "") {
      start++;
      listFood.push(new Food(el[0], el[1]));
      if (el[2] !== "") {
        listFood[start].getSunIng()[i].addRecipe(el[2]);
      }
    } else if (el[1]) {
      listFood[start].addSecondIng(new Recipes(el[1]));
      if (el[2] !== "") {
        listFood[start].getSunIng()[i].addRecipe(el[2]);
      }
    }
  });
  console.log(listFood);
}
const startBtn = document.querySelector(".button-49");
const textBox = document.querySelector(".text-box");
const chat = document.querySelector(".chat1");
let chatOn = false;
let subCat = false;

startBtn.addEventListener("click", function () {
  textBox.classList.add("hidden");
  chat.classList.remove("hidden");
  chatOn = true;
});

document.addEventListener("keydown", function (e) {
  if (chatOn && e.key === "Escape") {
    chat.classList.add("hidden");
    textBox.classList.remove("hidden");
  }
});

//CHATBOX
const msgerForm = get(".msger-inputarea");
const msgerInput = get(".msger-input");
const msgerChat = get(".msger-chat");

const BOT_IMG = "img/images.png";
const PERSON_IMG = "img/dog.jpg";
const BOT_NAME = "BOT";
const PERSON_NAME = "Dog";
const subMessage = "What would like to cook it with? Pasta or Rice?";
let type;
let foodIng;
let talking = false;
let skip = false;

appendMessage(
  BOT_NAME,
  BOT_IMG,
  "left",
  "Hello, I am your personal cooking assistant. <br> How I may help you today?"
);

const reset = function () {
  type = -1;
  foodIng = -1;
  talking = false;
  skip = false;
};

const capitalize = function (string) {
  return string[0].toUpperCase() + string.slice(1);
};
reset();
msgerForm.addEventListener("submit", (event) => {
  let counter = 0;
  let found = -1;
  event.preventDefault();

  const msgText = msgerInput.value;
  if (!msgText) return;
  appendMessage(PERSON_NAME, PERSON_IMG, "right", msgText);
  msgerInput.value = "";
  if (msgText.toLowerCase().includes("exit")) {
    setTimeout(() => {
      appendMessage(BOT_NAME, BOT_IMG, "left", "Feel free to ask me anything!");
    }, 1000);
    reset();
    return;
  }
  if (talking === false) {
    for (const food of listFood) {
      found = msgText.toLowerCase().search(food.getCat().toLowerCase());
      if (found !== -1) {
        type = counter;
        talking = true;
        break;
      }
      counter++;
    }
    if (found === -1) {
      setTimeout(() => {
        appendMessage(
          BOT_NAME,
          BOT_IMG,
          "left",
          "Sorry, it's not in our database. Try something else!"
        );
      }, 1000);
      return;
    }
  }
  if (talking) {
    if (!skip) {
      setTimeout(() => {
        appendMessage(
          BOT_NAME,
          BOT_IMG,
          "left",
          `Which of the following ingredients would you like to use? <br> -${capitalize(
            listFood[type].getSunIng()[0].getSecondIng()
          )}<br> -${capitalize(
            listFood[type].getSunIng()[1].getSecondIng()
          )}<br>-${capitalize(
            listFood[type].getSunIng()[2].getSecondIng()
          )}<br> -${capitalize(
            listFood[type].getSunIng()[3].getSecondIng()
          )}<br> -${capitalize(listFood[type].getSunIng()[4].getSecondIng())}`
        );
      }, 1000);
      skip = true;
      return;
    } else {
      for (const second of listFood[type].getSunIng()) {
        found = msgText
          .toLowerCase()
          .search(second.getSecondIng().toLowerCase());
        if (found !== -1) {
          foodIng = counter;
          break;
        }
        counter++;
      }
      if (foodIng !== counter) {
        setTimeout(() => {
          appendMessage(
            BOT_NAME,
            BOT_IMG,
            "left",
            "Please choose a valid ingredient or type exit to go ask me something new!"
          );
        }, 500);
        return;
      }
    }
  }
  skip = false;
  talking = false;
  console.log(msgText);

  botResponse();
});

function appendMessage(name, img, side, text) {
  //   Simple solution for small apps
  const msgHTML = `
    <div class="msg ${side}-msg">
      <div class="msg-img" style="background-image: url(${img})"></div>

      <div class="msg-bubble">
        <div class="msg-info">
          <div class="msg-info-name">${name}</div>
          <div class="msg-info-time">${formatDate(new Date())}</div>
        </div>

        <div class="msg-text">${text}</div>
      </div>
    </div>
  `;

  msgerChat.insertAdjacentHTML("beforeend", msgHTML);
  msgerChat.scrollTop += 500;
}

function botResponse() {
  // const r = random(0, BOT_MSGS.length - 1);
  // const msgText = BOT_MSGS[r];
  // const delay = msgText.split(" ").length * 100;

  const response = listFood[type].getSunIng()[foodIng].getRec()[0];
  foodIng = -1;
  type = -1;
  setTimeout(() => {
    appendMessage(BOT_NAME, BOT_IMG, "left", response);
  }, 500);
  setTimeout(() => {
    appendMessage(
      BOT_NAME,
      BOT_IMG,
      "left",
      "Feel free to ask me anything else!"
    );
  }, 2000);
}

// Utils
function get(selector, root = document) {
  return root.querySelector(selector);
}

function formatDate(date) {
  const h = "0" + date.getHours();
  const m = "0" + date.getMinutes();

  return `${h.slice(-2)}:${m.slice(-2)}`;
}

function random(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}
