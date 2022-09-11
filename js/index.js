const sectionList = document.querySelector('.section-list');
const cartList = document.querySelector('.cart-list');
const quantityDisplay = document.getElementById('quantity');
const totalDisplay = document.getElementById('total');
const totalizer = document.querySelectorAll('.totalizer');
const emptyList = document.querySelector('.empty-list');
const dataCart = [];
let quantity = 0;
let total = 0;

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
                // console.log(`item${i}`)
                dataCart.splice(i, 1);

                // item.style.transform = 'translateX(280px)';
                event.path[2].style.transform = 'translateX(280px)';

                sleep(500).then(() => {
                    event.path[2].remove()
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

fillSectionList(data);
function fillSectionList(list) {
    for (let i = 0; i < list.length; i++) {
        sectionList.innerHTML +=
            `<li class="section-item">
             <img src=${list[i].img} alt=${list[i].nameItem} title=${list[i].nameItem}>
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
            <img src=${list.img} alt=${list.nameItem}>
            <div>
                <h4>${list.nameItem}</h4>
                <span>R$ ${list.value.toFixed(2).replace(".", ",")}</span>
                <button id=${list.id} >Remover produto</button>
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
