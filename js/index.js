const navList = document.querySelector('.nav-list');
const sectionList = document.querySelector('.section-list');
const buttonSearch = document.getElementById('button-search');
const inputSearch = document.getElementById('input-search');
const cartList = document.querySelector('.cart-list');
const quantityDisplay = document.getElementById('quantity');
const totalDisplay = document.getElementById('total');
const totalizer = document.querySelectorAll('.totalizer');
const emptyList = document.querySelector('.empty-list');
const dataCart = [];
let listSearch = [];
let quantity = 0;
let total = 0;

fillSectionList(data);

inputSearch.onended = () => {
    console.log('ok')
    Perform(Wm_NextDlgCtl, 0, 0);
}
/* ------- FILTRAR POR CATEGORIA DO MOSTRUÁRIO --------- */
navList.onclick = (event) => {
    // console.dir(event.target.tagName)
    if (event.target.tagName == 'BUTTON') {
        let filtered = [];
        for (let i = 0; i < data.length; i++) {
            if (event.target.textContent == data[i].tag[0]) {
                filtered.push(data[i])
            }
        }
        sectionList.innerHTML = '';
        fillSectionList(filtered);
        if (event.target.textContent == "Todos") {
            fillSectionList(data);
        }
    }
}

/* ------- PESQUISAR POR PALAVRA(S) CHAVE --------- */
buttonSearch.addEventListener('click', itemSearch);
inputSearch.addEventListener('focusout', itemSearch);

function itemSearch() {
    listSearch = [];
    const input = inputSearch.value.toLowerCase();
    for (let i = 0; i < data.length; i++) {
        if (data[i].nameItem.toLowerCase().indexOf(input) != -1) {
            listSearch.push(data[i]);
        }
    }
    sectionList.innerHTML = '';
    fillSectionList(listSearch);

    inputSearch.value = '';
}


/* ------- ADICIONAR ITENS AO CARRINHO --------- */
sectionList.onclick = (event) => {
    if (event.target.tagName == "BUTTON") {
        let normalizeValue = event.path[1].children[3].textContent.substring(2).replace(",", ".");
        // console.log(typeof(normalizeValue));
        const addProduct = {
            id: event.target.id,
            img: event.path[2].children[0].src,
            nameItem: event.path[1].children[1].textContent,
            value: parseFloat(normalizeValue)
        }

        dataCart.push(addProduct)
        fillCartList(addProduct);


        // event.path[2].style.transform = 'translateX(280px)';

        quantity++;
        quantityDisplay.innerText = quantity;

        totalDisplay.innerText = cartTotal(dataCart);
    }
    if (quantity == 1) {
        cartList.style.display = 'flex';
        totalizer[0].style.display = 'flex';
        totalizer[1].style.display = 'flex';
        emptyList.style.display = 'none';
    }

}

/* ------- REMOVER ITENS DO CARRINHO --------- */
cartList.onclick = (event) => {
    if (event.target.tagName == "BUTTON") {

        for (let i = 0; i < dataCart.length; i++) {

            if (dataCart[i].id == event.target.id) {
                const item = document.getElementById(`item${dataCart[i].id}`);
                dataCart.splice(i, 1);
                event.path[3].style.transform = 'translateX(280px)';

                sleep(500).then(() => {
                    event.path[3].remove()
                });

                break;
            }
        }

        quantity--;
        quantityDisplay.innerText = quantity;
        totalDisplay.innerText = cartTotal(dataCart);

        if (quantity == 0) {
            sleep(500).then(() => {
                cartList.style.display = 'none';
                totalizer[0].style.display = 'none';
                totalizer[1].style.display = 'none';
                emptyList.style.display = 'flex';
            });
        }
    }
    // console.log("Carrinho depois da exclusão: ", dataCart);
}

function cartTotal(list) {
    let output = 0;
    for (let i = 0; i < list.length; i++) {
        output += list[i].value;
    }

    return output.toFixed(2).replace(".", ",");
}


function fillSectionList(list) {
    for (let i = 0; i < list.length; i++) {
        sectionList.innerHTML +=
            `<li class="section-item">
             <img src=${list[i].img} alt='${list[i].nameItem}' title='${list[i].nameItem}'>
                <div>
                    <span>${list[i].tag}</span>
                    <h3>${list[i].nameItem}</h3>
                    <p>${list[i].description}</p>
                    <span>R$ ${list[i].value.toFixed(2).replace(".", ",")}</span>
                    <button id=${list[i].id}>${list[i].addCart}</button>
                </div>
            </li>
            `
    }
}

function fillCartList(list) {
    cartList.innerHTML +=
        `<li class="cart-item" id='item${list.id}'>
            <div class="product">
                <img src=${list.img} alt=${list.nameItem}>
                <div>
                    <h4>${list.nameItem}</h4>
                    <span>R$ ${list.value.toFixed(2).replace(".", ",")}</span>
                    <button id=${list.id} >Remover produto</button>
                </div>
            </div>
            <div class='quantity-item'>
                <span id='increment'>+</span>
                <span>0</span>
                <span id='decrement'>-</span>
            </div>
        </li>
        `
    const item = document.getElementById(`item${list.id}`);
    sleep(300).then(() => {
        item.style.transform = 'translateX(0px)';
    });

    // console.log("Carrinho depois da inclusão: ", dataCart);
}

const sleep = milliseconds => {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
};

/* `<li class="cart-item" id='item${list.id}'>
            <div class='products'>
                <img src=${list.img} alt=${list.nameItem}>
                <div class='description-item'>
                    <h4>${list.nameItem}</h4>
                    <span>R$ ${list.value.toFixed(2).replace(".", ",")}</span>
                    <button id=${list.id} >Remover produto</button>
                </div>
            </div>    
            <div class='quantity-item'>
                <span>+</span>
                <span>0</span>
                <span>-</span>
            </div>
        </li> */