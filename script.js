
// const botToken = '7627776866:AAEpiv6IMSoeVp4PhL4nq20pRjctPbbiMWY'; // Вставте ваш токен
// const chatId = '906770283';    // Вставте ваш chat_id

// Змінна для відслідковування, чи було відкрито кошик
let isCartModalOpen = false;
let cart = JSON.parse(localStorage.getItem('cart')) || []; // Завантаження кошика з LocalStorage

// Функція для збереження кошика в LocalStorage
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}
// Показати модальне вікно
function showAddToCartModal() {
    const modal = document.getElementById('addToCartModal');
    modal.style.display = 'flex'; // Робимо вікно видимим
    document.body.style.overflow = "hidden";

}

// Обробка кліків на кнопках у модальному вікні
document.getElementById('continueShopping').addEventListener('click', () => {
    document.getElementById('addToCartModal').style.display = 'none';
    document.body.style.overflow = "";
});

document.getElementById('viewCart').addEventListener('click', () => {
    updateCartDisplay(); // Оновлення вмісту кошика перед відкриттям
    document.getElementById('cartModal').style.display = 'flex'; // Відкриття модального вікна
    document.body.style.overflow = 'hidden'; // Заборона прокрутки фону
    localStorage.setItem('isCartModalOpen', 'true'); // Зберігаємо статус відкриття модального вікна
    });



// Оновлення кошика в інтерфейсі
function updateCartDisplay() {
    const cartItems = document.getElementById('cartItems');
    const totalPrice = document.getElementById('totalPrice');
    cartItems.innerHTML = ''; // Очищення попереднього вмісту кошика
    let total = 0;      

    // Завантаження кошика з LocalStorage
    const cart = JSON.parse(localStorage.getItem('cart')) || [];

    cart.forEach((item, index) => {
        const li = document.createElement('li');
        li.classList.add('cart-item'); // Додаємо клас для стилізації

        // Створюємо елемент для зображення
        const img = document.createElement('img');
        img.src = item.image || '/img/logo.avif'; // Використовуємо URL зображення
        img.alt = item.name;
        img.classList.add('cart-item-image'); // Клас для стилізації зображення

        // Елемент для текстової інформації (назва + ціна)
        const infoDiv = document.createElement('div');
        infoDiv.classList.add('cart-item-info');

        const nameSpan = document.createElement('span');
        nameSpan.textContent = item.name;
        nameSpan.classList.add('cart-item-name');

        const priceSpan = document.createElement('span');
        priceSpan.textContent = `${item.price * item.quantity} грн`;
        priceSpan.classList.add('cart-item-price');


        // Створюємо елемент для вибору кількості
        const quantityDiv = document.createElement('div');
        quantityDiv.classList.add('cart-item-quantity');
    
        const decreaseButton = document.createElement('button');
        decreaseButton.textContent = '-';
        decreaseButton.classList.add('quantity-decrease');
        decreaseButton.addEventListener('click', () => {
            if (item.quantity > 1) {
                item.quantity--;
                updateCartInLocalStorage(cart);
                updateCartDisplay();
            }
        });

        const quantityInput = document.createElement('input');
        quantityInput.type = 'number';
        quantityInput.value = item.quantity || 1;
        quantityInput.min = 1;
        quantityInput.classList.add('quantity-input');
        quantityInput.addEventListener('change', () => {
            const newQuantity = parseInt(quantityInput.value, 10) || 1;
            item.quantity = Math.max(newQuantity, 1); // Мінімум 1 товар
            updateCartInLocalStorage(cart);
            updateCartDisplay();
        });

        const increaseButton = document.createElement('button');
        increaseButton.textContent = '+';
        increaseButton.classList.add('quantity-increase');
        increaseButton.addEventListener('click', () => {
            item.quantity++;
            updateCartInLocalStorage(cart);
            updateCartDisplay();
        });

        quantityDiv.appendChild(decreaseButton);
        quantityDiv.appendChild(quantityInput);
        quantityDiv.appendChild(increaseButton);


        // Кнопка для видалення товару
        const removeButton = document.createElement('button');
        removeButton.textContent = '×'; // Хрестик замість тексту
        removeButton.classList.add('removeItem');
        removeButton.addEventListener('click', () => {
            cart.splice(index, 1); // Видалення товару з кошика
            localStorage.setItem('cart', JSON.stringify(cart)); // Оновлення LocalStorage
            updateCartDisplay(); // Оновлення відображення кошика
            updateCartCount(); // Оновлення значка кількості товарів
        });

        // Додаємо всі елементи до `li`
        infoDiv.appendChild(nameSpan);
        infoDiv.appendChild(priceSpan);
        li.appendChild(img);
        li.appendChild(infoDiv);
        li.appendChild(quantityDiv);
        li.appendChild(removeButton);
    
        cartItems.appendChild(li);
        total += item.price * item.quantity;
    });
    totalPrice.textContent = total; // Оновлення загальної суми
}

// Оновлення LocalStorage
function updateCartInLocalStorage(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
}
// Додати товар до кошика
document.querySelectorAll('.addToCart').forEach(button => {
    button.addEventListener('click', event => {
        event.stopPropagation(); // Зупиняємо поширення події

        const modal = document.getElementById('productModal');
        modal.style.display = 'none';

        // Отримуємо елементи товару (або з модального вікна, або з продукту)
        const productElement = button.closest('.modal-content_2') || button.closest('.product');
        if (!productElement) return; // Якщо елемент не знайдено, нічого не робимо

        // Отримуємо атрибути товару
        const name = productElement.getAttribute('data-name');
        const price = parseFloat(productElement.getAttribute('data-price')); // Отримуємо ціну з елемента продукту
        const images = JSON.parse(productElement.getAttribute('data-image') || '[]'); // Отримуємо масив зображень
        const image = images.length > 0 ? images[0] : '/img/logo.avif'; // Перше зображення або дефолтне

        // Перевірка, чи дані отримані правильно
        console.log('Дані товару:', { name, price, images });

        // Завантаження кошика з LocalStorage
        const cart = JSON.parse(localStorage.getItem('cart')) || [];

        // Перевірка, чи товар вже є в кошику
        const existingItem = cart.find(item => item.name === name);

        if (existingItem) {
            existingItem.quantity += 1; // Збільшення кількості
        } else {
            cart.push({ name, price, image, quantity: 1 }); // Додавання нового товару
        }

        // Збереження кошика в LocalStorage
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        updateCartDisplay();

        // Додати ефект "додано" до кнопки
        button.classList.add('added');
        setTimeout(() => button.classList.remove('added'), 1000);

        // Показати модальне вікно "Додано в кошик"
        showAddToCartModal();
    });
});


// Закрити модальне вікно при переході в корзину
document.getElementById('viewCart').addEventListener('click', () => {
    const modal = document.getElementById('addToCartModal');
    modal.style.display = 'none';
});




// Оновлення кількості товарів на кнопці
function updateCartCount() {
    const cartCount = document.getElementById('cartCount');
    const cart = JSON.parse(localStorage.getItem('cart')) || []; // Завантаження кошика
    const itemCount = cart.length;
    cartCount.textContent = itemCount; // Оновлення тексту з кількістю товарів

    // Якщо є товари в кошику, показуємо крапку
    if (itemCount > 0) {
        cartCount.style.display = 'inline-block';
    } else {
        cartCount.style.display = 'none';
    }
}


// Відкриття модального вікна кошика
document.getElementById('viewCartButton').addEventListener('click', () => {
    updateCartDisplay(); // Оновлення вмісту кошика перед відкриттям
    document.getElementById('cartModal').style.display = 'flex'; // Відкриття модального вікна
    document.body.style.overflow = 'hidden'; // Заборона прокрутки фону
    localStorage.setItem('isCartModalOpen', 'true'); // Зберігаємо статус відкриття модального вікна
});

// Закриття модального вікна
document.getElementById('closeModal').addEventListener('click', () => {
    document.getElementById('cartModal').style.display = 'none'; // Закриваємо модальне вікно
    document.body.style.overflow = 'auto'; // Дозволяємо прокрутку сторінки
    localStorage.setItem('isCartModalOpen', 'false'); // Зберігаємо статус закриття модального вікна
});

// Оновлення кошика при завантаженні сторінки
window.addEventListener('load', () => {
    updateCartCount(); // Оновлюємо кількість товарів
    updateCartDisplay(); // Оновлюємо відображення кошика

    // Перевіряємо статус модального вікна в localStorage
    const isCartModalOpen = localStorage.getItem('isCartModalOpen') === 'true';

    if (isCartModalOpen) {
        document.getElementById('cartModal').style.display = 'flex'; // Відкриваємо модальне вікно
        document.body.style.overflow = 'hidden'; // Забороняємо прокрутку фону
    } else {
        document.getElementById('cartModal').style.display = 'none'; // Закриваємо модальне вікно
        document.body.style.overflow = 'auto'; // Дозволяємо прокрутку сторінки
    }
});


// Відправити замовлення в Telegram
document.getElementById('sendOrder').addEventListener('click', () => {
    const botToken = '7627776866:AAEpiv6IMSoeVp4PhL4nq20pRjctPbbiMWY'; // Вставте ваш токен
    const chatId = '906770283';    // Вставте ваш chat_id

    // Перевірка, чи кошик порожній
    let cart = JSON.parse(localStorage.getItem('cart')) || []; // Завантаження кошика з LocalStorage
    if (cart.length === 0) {
        const errorMessage = document.getElementById('cartErrorMessage');
        errorMessage.textContent = 'Спочатку виберіть товар!';
        errorMessage.style.display = 'block'; // Показуємо повідомлення
        return;
    } else {
        const errorMessage = document.getElementById('cartErrorMessage');
        errorMessage.style.display = 'none'; // Ховаємо повідомлення
    }

    // Отримання даних форми
    const name = document.getElementById('name').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const city = document.getElementById('city').value.trim();
    const warehouse = document.getElementById('warehouse').value.trim();

      // Перевірка заповнення форми
    if (!name || !phone || !city || !warehouse) {
        // Показати повідомлення в кошику
        const errorMessage = document.getElementById('cartErrorMessage');
        errorMessage.style.display = 'block'; // Показуємо повідомлення
        return;
    } else {
        // Якщо всі поля заповнені, приховуємо повідомлення про помилку
        const errorMessage = document.getElementById('cartErrorMessage');
        errorMessage.style.display = 'none'; // Ховаємо повідомлення
    };

    // Формування повідомлення
    let message = 'Нове замовлення:\n\n';
    cart.forEach(item => {
        message += `${item.name} - ${item.price} грн\n`;
    });

    const total = cart.reduce((sum, item) => sum + item.price, 0);
    message += `\nЗагальна сума: ${total} грн\n\n`;
    message += `Дані для доставки:\n`;
    message += `Прізвище та ім'я: ${name}\n`;
    message += `Телефон: ${phone}\n`;
    message += `Місто: ${city}\n`;
    message += `Номер відділення: ${warehouse}\n`;

    // Відправка замовлення в Telegram
    fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: chatId, text: message })
    })
        .then(response => {
            const successMessage = document.getElementById('successMessage');

            if (response.ok) {
                // Відображення повідомлення у модальному вікні
                successMessage.textContent = 'Замовлення успішно відправлено! Дякуємо за покупку.';
                successMessage.classList.remove('hidden'); // Показуємо повідомлення
                cart = []; // Очистити кошик
                saveCart(); // Оновити LocalStorage
                updateCartDisplay(); // Оновити інтерфейс

                // Очищення форми
                document.getElementById('deliveryForm').reset();

            } else {
                successMessage.textContent = 'Помилка відправки замовлення. Спробуйте ще раз.';
                successMessage.classList.remove('hidden'); // Показуємо повідомлення
            }
        });
});

// Плавний скрол до категорій з урахуванням відступу
document.querySelectorAll('.categories-menu a, .main-banner a').forEach(link => {
    link.addEventListener('click', event => {
        event.preventDefault();
        
        const targetId = link.getAttribute('href').slice(1); // Отримуємо ID цілі
        const targetSection = document.getElementById(targetId); // Знаходимо секцію

        if (targetSection) {
            const offset = 150; // Відступ у пікселях

            // Обчислення позиції з урахуванням відступу
            const offsetPosition = targetSection.offsetTop - offset;

            // Плавний скрол
            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});


//_---------------------------------------------------------------------------------------------
// Функція для зчитування CSV
function loadCSV(filePath, callback) {
    fetch(filePath)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.text();
        })
        .then(csvData => {
            const rows = csvData.trim().split('\n').map(row => row.split(','));
            const headers = rows[0]; // Перший рядок - заголовки
            const data = rows.slice(1).map(row => {
                return headers.reduce((acc, header, index) => {
                    acc[header.trim()] = row[index]?.trim() || '—';
                    return acc;
                }, {});
            });
            callback(data);
        })
        .catch(error => console.error('Помилка при зчитуванні CSV:', error));
}


//_----------------------------------------------------------------------------------------------
// Логіка для відкриття модального вікна з інформацією про товар
document.querySelectorAll('.product').forEach(product => {
    product.addEventListener('click', event => {
        // Перевірка: якщо натиснута кнопка "Додати до кошика", ігноруємо цю подію
        if (event.target.classList.contains('addToCart')) {
            return;
        }

        // Отримання інформації про товар
        const name = product.getAttribute('data-name');
        const description = product.getAttribute('data-description');
        const images = JSON.parse(product.getAttribute('data-image'));
        const price = product.getAttribute('data-price');


        // Встановлення даних у модальне вікно
        const modalContent = document.querySelector('.modal-content_2');
        modalContent.setAttribute('data-name', name);
        modalContent.setAttribute('data-price', price);
        modalContent.setAttribute('data-image', JSON.stringify(images));
        
        document.getElementById('productName').textContent = name;
        document.getElementById('productDescription').textContent = description;

        // Перевірка, чи є ціна
        if (price) {
            document.getElementById('productPrice').textContent = `Ціна: ${price} грн`;
        } else {
            document.getElementById('productPrice').textContent = 'Ціна не вказана';
        }


        // Відображення першого зображення
        let currentImageIndex = 0;
        const productImage = document.getElementById('productImage');
        productImage.src = images[currentImageIndex];



        //--------------------------------
        // Генеруємо мініатюри
        const thumbnailsContainer = document.getElementById('thumbnails');
        thumbnailsContainer.innerHTML = ''; // Очищуємо попередні мініатюри
        
        images.forEach((imgSrc, index) => {
            const thumbnail = document.createElement('img');
            thumbnail.src = imgSrc;
            thumbnail.alt = `Мініатюра ${index + 1}`;
            thumbnail.classList.add('thumbnail');
            if (index === 0) thumbnail.classList.add('active'); // Підсвічуємо першу мініатюру

            thumbnail.addEventListener('click', () => {
                currentImageIndex = index;
                updateMainImage(currentImageIndex); // Змінюємо головне зображення
            });

            thumbnailsContainer.appendChild(thumbnail);
        });

        // Синхронізуємо мініатюри з активним зображенням
        function syncThumbnails() {
            document.querySelectorAll('#thumbnails img').forEach((img, index) => {
                if (index === currentImageIndex) {
                    img.classList.add('active');
                } else {
                    img.classList.remove('active');
                }
            });
        }

        // Оновлення головного зображення
        function updateMainImage(index) {
            productImage.src = images[index];
            syncThumbnails(); // Синхронізація мініатюр
        }
        //-----------------------------------------------------
        let isDragging = false;
        let startX = 0;
        let currentTranslate = 0;
        let previousTranslate = 0;

        const productGallery = document.getElementById('productGallery');
        

        // Початок перетягування
        productGallery.addEventListener('mousedown', (e) => {
            e.preventDefault();
            isDragging = true;
            startX = e.clientX;
            productImage.style.transition = 'none'; // Вимикаємо плавність під час перетягування
        });
        
        // Відстеження руху миші
        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
        
            e.preventDefault();
            const currentX = e.clientX;
            const deltaX = currentX - startX;
            currentTranslate = previousTranslate + deltaX;
        
            productImage.style.transform = `translateX(${currentTranslate}px)`;
        });
        
        // Кінець перетягування
        document.addEventListener('mouseup', () => {
            if (!isDragging) return;
            isDragging = false;
        
            const movedBy = currentTranslate - previousTranslate;
        
            if (movedBy < -50) {
                // Зміна на наступне зображення
                changeImage('next');
            } else if (movedBy > 50) {
                // Зміна на попереднє зображення
                changeImage('prev');
            } else {
                // Повернення на початкову позицію
                productImage.style.transition = 'transform 0.3s ease';
                productImage.style.transform = `translateX(${previousTranslate}px)`;
            }


        });
        
        // Функція зміни зображення з плавністю
        function changeImage(direction) {
            const nextImageIndex =
                direction === 'next'
                    ? (currentImageIndex + 1) % images.length
                    : (currentImageIndex - 1 + images.length) % images.length;

            const entryDirection = direction === 'next' ? 'fromRight' : 'fromLeft';

            // Вихід поточного зображення
            productImage.style.transition = 'transform 0.3s ease';
            productImage.style.transform = direction === 'next' ? 'translateX(-150%)' : 'translateX(150%)';

            productImage.addEventListener(
                'transitionend',
                function onTransitionEnd() {
                    productImage.removeEventListener('transitionend', onTransitionEnd);

                    // Миттєве оновлення нового зображення в потрібній позиції
                    productImage.src = images[nextImageIndex];
                    productImage.style.transition = 'none'; // Вимикаємо плавність перед оновленням
                    productImage.style.transform =
                        entryDirection === 'fromRight' ? 'translateX(100%)' : 'translateX(-100%)';

                    setTimeout(() => {
                        // Вхід нового зображення
                        productImage.style.transition = 'transform 0.3s ease';
                        productImage.style.transform = 'translateX(0)';
                    }, 10); // Невелика затримка для плавності переходу
                }
            );

            currentImageIndex = nextImageIndex; // Оновлюємо поточний індекс
            syncThumbnails(); // Синхронізуємо мініатюри після зміни
        }

        // Оновлення головного зображення
        function updateMainImage(index) {
            productImage.src = images[index];
            syncThumbnails(); // Синхронізація мініатюр
        }
        
        // Заборона стандартного перетягування зображення
        productImage.addEventListener('dragstart', (e) => e.preventDefault());

        
        const csvFilePath = product.getAttribute('data-csv'); // Отримуємо шлях до CSV
        // Перевірка наявності шляху до CSV
        if (!csvFilePath) {
            console.log('Шлях до CSV не вказаний для товару:', name);
            return;
        }

        // ----- Завантаження CSV і відображення даних у таблиці-----
        loadCSV(csvFilePath, data => {
            // console.log('Парсинг CSV:', data); 
            const specsTable = document.getElementById('productSpecs').querySelector('tbody');
            specsTable.innerHTML = ''; // Очищення таблиці
            data.forEach(spec => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${spec['Назва'] || '—'}</td>
                    <td>${spec['Значення'] || '—'}</td>
                `;
                specsTable.appendChild(row);
            });
        });
        
        // Відкриття модального вікна
        document.getElementById('productModal').style.display = 'flex';
        document.body.style.overflow = "hidden";
    });
});

// Закриття модального вікна
document.getElementById('closeProductModal').addEventListener('click', () => {
    document.getElementById('productModal').style.display = 'none';
    document.body.style.overflow = "";

});


// Відкрити зображення на весь екран
function openFullscreenImage() {
    const productImage = document.getElementById('productImage');
    const fullscreenModal = document.getElementById('fullscreenModal');
    const fullscreenImage = document.getElementById('fullscreenImage');

    fullscreenImage.src = productImage.src; // Отримати URL зображення товару
    fullscreenModal.style.display = 'flex';
    document.body.style.overflow = "hidden";
}

// Закрити повноекранне зображення
function closeFullscreenImage() {
    const fullscreenModal = document.getElementById('fullscreenModal');
    fullscreenModal.style.display = 'none';
    document.body.style.overflow = "";
}



// Оновити кількість товарів на сторінці при завантаженні
updateCartCount();
// Оновлення кошика при завантаженні сторінки
updateCartDisplay();


// ...existing code...

function openProductModal(product) {
    const modal = document.getElementById('productModal');
    // ...заповнення інформації про товар...
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

function closeProductModal() {
    const modal = document.getElementById('productModal');
    modal.style.display = 'none';
    document.body.style.overflow = '';
}

function initProductModal() {
    const modal = document.getElementById('productModal');
    // Закриття по кліку на вільний простір (фон)
    modal.addEventListener('mousedown', function(e) {
        if (e.target === modal) {
            closeProductModal();
        }
    });

    // Закриття по Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.style.display === 'flex') {
            closeProductModal();
        }
    });
}

document.addEventListener('DOMContentLoaded', function() {
    initProductModal();
});

//