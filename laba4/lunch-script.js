const selectedDishes = {
    soup: null,
    "main-dish": null,
    drink: null
};

const categoryNames = {
    soup: "Суп",
    "main-dish": "Главное блюдо",
    drink: "Напиток",
};

const emptyMessages = {
    soup: "Суп не выбран",
    "main-dish": "Блюдо не выбрано",
    drink: "Напиток не выбран"
};

function createDishCard(dish) {
    return `
        <div class="dish" data-dish="${dish.keyword}">
            <img src="${dish.image}" alt="${dish.name}">
            <p class="dish-price">${dish.price} ₽</p>
            <p class="dish-name">${dish.name}</p>
            <p class="dish-weight">${dish.count}</p>
            <button type="button" class="add-btn">Добавить</button>
        </div>
    `;
}

function renderDishes() {
    document.querySelectorAll(".dishes").forEach((container) => {
        container.innerHTML = dishes
            .filter((dish) => dish.category === container.dataset.category)
            .sort((a, b) => a.name.localeCompare(b.name, "ru"))
            .map(createDishCard)
            .join("");
    });
}

function updateHiddenFields() {
    for (const category in selectedDishes) {
        const dish = selectedDishes[category];
        document.querySelector(`#selected-${category}`).value =
            dish ? dish.keyword : "";
    }
}

function updateOrder() {
    const orderContent = document.querySelector("#order-content");
    const chosen = Object.values(selectedDishes).filter(Boolean);

    if (chosen.length === 0) {
        orderContent.innerHTML = "<p>Ничего не выбрано</p>";
    } else {
        const items = Object.entries(selectedDishes)
            .map(([category, dish]) => `
                <div class="order-item">
                    <p>${categoryNames[category]}</p>
                    <p>${dish ? `${dish.name} - ${dish.price} ₽` : emptyMessages[category]}</p>
                </div>
            `)
            .join("");

        const total = chosen.reduce((sum, dish) => sum + dish.price, 0);

        orderContent.innerHTML = `
            ${items}
            <div class="total-price">
                <p>Стоимость заказа</p>
                <p>${total} ₽</p>
            </div>
        `;
    }

    updateHiddenFields();
}

function selectDish(event) {
    const button = event.target.closest(".add-btn");
    if (!button) return;

    const card = button.closest(".dish");
    const dish = dishes.find((item) => item.keyword === card.dataset.dish);

    selectedDishes[dish.category] = dish;

    document
        .querySelectorAll(`.dishes[data-category="${dish.category}"] .dish`)
        .forEach((item) => item.classList.toggle("selected", item === card));

    updateOrder();
}

renderDishes();
document.addEventListener("click", selectDish);