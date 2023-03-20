const navList = document.querySelector(".nav-list");
const sectionList = document.querySelector(".section-list");
const buttonSearch = document.getElementById("button-search");
const inputSearch = document.getElementById("input-search");
const quantityItems = document.querySelector(".quantity-items");
const cartList = document.querySelector(".cart-list");
const quantityDisplay = document.getElementById("quantity");
const totalDisplay = document.getElementById("total");
const totalizer = document.querySelectorAll(".totalizer");
const emptyList = document.querySelector(".empty-list");
const dataCart = [];
let listSearch = [];
let quantity = 0;
let total = 0;

/* ------- PREENCHER O MOSTRUÁRIO --------- */
fillSectionList(data);

/* ------- FILTRAR POR CATEGORIA DO MOSTRUÁRIO --------- */
navList.onclick = (event) => {
  if (event.target.tagName == "BUTTON") {
    let filtered = [];
    for (let i = 0; i < data.length; i++) {
      if (event.target.textContent == data[i].tag[0]) filtered.push(data[i]);
    }
    sectionList.innerHTML = "";
    fillSectionList(filtered);
    if (event.target.textContent == "Todos") fillSectionList(data);

    for (let i = 0; i < 5; i++) {
      if (event.target.closest("li").id) {
        if (
          event.target.closest("ul").children[i].id ==
          event.target.closest("li").id
        ) {
          event.target
            .closest("ul")
            .children[i].children[0].classList.add("btn-pressed");
        } else {
          event.target
            .closest("ul")
            .children[i].children[0].classList.remove("btn-pressed");
        }
      }
    }
  }
};

/* ------- PESQUISAR POR PALAVRA(S) CHAVE --------- */
buttonSearch.addEventListener("click", itemSearch);
inputSearch.addEventListener("keyup", itemSearch);

function itemSearch() {
  listSearch = [];
  const input = inputSearch.value.toLowerCase();
  for (let i = 0; i < data.length; i++) {
    if (data[i].nameItem.toLowerCase().indexOf(input) != -1)
      listSearch.push(data[i]);
  }

  sectionList.innerHTML = "";

  if (listSearch.length > 0) fillSectionList(listSearch);
  else
    sectionList.innerHTML = `<img id='not-found' src='../img/no-product.png' alt='produto não encontrado'/>`;

  for (let i = 0; i < 5; i++) {
    navList.children[i].children[0].classList.remove("btn-pressed");
  }
}

/* ------- ADICIONAR ITENS AO CARRINHO --------- */
sectionList.onclick = (event) => {
  if (event.target.tagName == "BUTTON") {
    const target = event.target;
    let normalizeValue = target
      .closest("div")
      .children[3].textContent.substring(2)
      .replace(",", ".");
    const addProduct = {
      id: event.target.id,
      img: event.target.closest("li").children[0].src,
      nameItem: event.target.closest("div").children[1].textContent,
      value: parseFloat(normalizeValue),
      amount: 1,
    };

    if (dataCart.length == 0 || verifyDuplicity(event)) {
      quantity++;
      dataCart.push(addProduct);
      fillCartList(addProduct);
      cartTotal(dataCart);
    }

    if (quantity == 1) {
      cartList.style.display = "flex";
      totalizer[0].style.display = "flex";
      totalizer[1].style.display = "flex";
      emptyList.style.display = "none";
    }
  }
};

/* ------- VERIFICA SE O ITEM JÁ ESTÁ NO CARRINHO --------- */
function verifyDuplicity(event) {
  for (let i = 0; i < dataCart.length; i++) {
    if (dataCart[i].id == event.target.id) return false;
  }
  return true;
}

cartList.onclick = (event) => {
  /* ------- REMOVER ITENS DO CARRINHO --------- */
  if (event.target.tagName == "BUTTON") {
    for (let i = 0; i < dataCart.length; i++) {
      if (dataCart[i].id == event.target.id) {
        quantity -= dataCart[i].amount;
        dataCart.splice(i, 1);
        event.target.closest("li").style.transform = "translateX(280px)";

        sleep(600).then(() => {
          event.target.closest("li").remove();
        });
        break;
      }
    }

    cartTotal(dataCart);

    if (quantity == 0) {
      sleep(500).then(() => {
        cartList.style.display = "none";
        totalizer[0].style.display = "none";
        totalizer[1].style.display = "none";
        emptyList.style.display = "flex";
      });
    }
  }

  /* ------- EDITAR QUANTIDADE DE ITENS POR PRODUTO --------- */
  if (event.target.id == "increment") {
    for (let i = 0; i < dataCart.length; i++) {
      if (`item${dataCart[i].id}` == event.target.closest("li").id) {
        const quantityItem = document.getElementById(
          `display-${dataCart[i].id}`
        );
        dataCart[i].amount++;
        quantityItem.innerText = dataCart[i].amount;
        quantity++;
        cartTotal(dataCart);
      }
    }
  }

  if (event.target.id == "decrement") {
    for (let i = 0; i < dataCart.length; i++) {
      if (`item${dataCart[i].id}` == event.target.closest("li").id) {
        if (dataCart[i].amount > 1) {
          const quantityItem = document.getElementById(
            `display-${dataCart[i].id}`
          );
          dataCart[i].amount--;
          quantityItem.innerText = dataCart[i].amount;
          quantity--;
          cartTotal(dataCart);
        }
      }
    }
  }
};

/* ------- CALCULA E EXIBE O TOTAL DO CARRINHO --------- */
function cartTotal(list) {
  let output = 0;
  for (let i = 0; i < list.length; i++) {
    output += list[i].value * list[i].amount;
  }
  quantityDisplay.innerText = quantity;
  totalDisplay.innerText = "R$ " + output.toFixed(2).replace(".", ",");
}

/* ------- PREENCHER O MOSTRUÁRIO --------- */
function fillSectionList(list) {
  for (let i = 0; i < list.length; i++) {
    sectionList.innerHTML += `<li class="section-item">
             <img src=${list[i].img} alt='${list[i].nameItem}'/>
                <div>
                    <span>${list[i].tag}</span>
                    <h3>${list[i].nameItem}</h3>
                    <p>${list[i].description}</p>
                    <span>R$ ${list[i].value
                      .toFixed(2)
                      .replace(".", ",")}</span>
                    <button id=${list[i].id}>${list[i].addCart}</button>
                </div>
            </li>
            `;
  }
}

/* ------- PREENCHER O CARRINHO --------- */
function fillCartList(list) {
  cartList.innerHTML += `<li class="cart-item" id='item${list.id}'>
            <div class="product-desc">
                <img src=${list.img} alt='${list.nameItem}'/>
                <div>
                    <h4>${list.nameItem}</h4>
                    <span>R$ ${list.value.toFixed(2).replace(".", ",")}</span>
                    <button id=${list.id} >Remover produto</button>
                </div>
            </div>
            <div class='quantity-items'>
                <span id='increment'>+</span>
                <span id='display-${list.id}'>${list.amount}</span>
                <span id='decrement'>-</span>
            </div>
        </li>
        `;
  const item = document.getElementById(`item${list.id}`);
  sleep(300).then(() => {
    item.style.transform = "translateX(0px)";
  });
}

/* ------- PAUSA O SCRIPT --------- */
const sleep = (milliseconds) => {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
};
