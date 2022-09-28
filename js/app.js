



//Constructors
function Insurance(brand, year, type) {
    this.brand = brand;
    this.year = year;
    this.type = type;
}

//Perform the quote with the data
Insurance.prototype.quoteInsurance = function() {
    /*
        1 = Americano 1.15
        2 = Asiatico 1.05
        3 = Europeo 1.35
     */

    let amount;
    const base = 2000;

    switch(this.brand) {
        case '1':
            amount = base * 1.15;
            break;
        case '2':
            amount = base * 1.05;
            break;
        case '3':
            amount = base * 1.35;
            break;
        default:
            break;
    }

    //Read the year
    const diference = new Date().getFullYear() - this.year;

    //For each year older, the cost will be reduced by 3%
    amount -= ((diference * 3) * amount) / 100;

    /*
        If the insurance is basic, it is multiplied by 30% more
        If the insurance is complete, it is multiplied by 50% more
    */

    if(this.type === 'basic'){
        amount *= 1.30;
    } else {
        amount *= 1.50;
    }


    return amount;
}


function UI() {}


//fill in the options of the years
UI.prototype.fillOptions = () => {
    const max = new Date().getFullYear(),
          min = max - 20;

    const selectYear = document.querySelector('#year');

    for (let i = max; i > min; i--) {
        let option = document.createElement('option');
        option.value = i;
        option.textContent = i;
        selectYear.appendChild(option);
    }
}

//Show alerts on screen
UI.prototype.showMessage = (message, type) => {
    const div = document.createElement('div');

    if(type === 'error') {
        div.classList.add('mensaje', 'error')
    } else {
        div.classList.add('mensaje', 'correcto')
    }

    div.classList.add('mensaje', 'mt-10');
    div.textContent = message;

    //Insert to HTML
    const form = document.querySelector('#cotizar-seguro');
    form.insertBefore(div, document.querySelector('#resultado'));

    setTimeout(() => {
        div.remove();
    }, 3000);
}

UI.prototype.showResult = (total, insurance) => {

    const {brand, year, type} = insurance;

    let textBrand;

    switch(brand){
        case "1":
            textBrand = 'Americano'
            break;
        
        case "2":
            textBrand = 'Asiatico'
            break;

        case "3":
            textBrand = 'Europeo'
            break;
        default:
            break;
    }


    //Make the result
    const div = document.createElement('div');
    div.classList.add('mt-10');

    div.innerHTML = `
        <p class="header">Tu Resumen</p>
        <p class="font-bold">Marca: <span class="font-normal"> ${textBrand} </span></p>
        <p class="font-bold">Año: <span class="font-normal"> ${year} </span></p>
        <p class="font-bold">Tipo: <span class="font-normal capitalize"> ${type} </span></p>
        <p class="font-bold">Total: <span class="font-normal"> $${total} </span></p>
    `;

    const resultDiv = document.querySelector('#resultado');
    

    //Show the spinner
    const spinner = document.querySelector('#cargando');
    spinner.style.display = 'block';

    setTimeout(() => {
        spinner.style.display = 'none'; //The spinner is deleted but the result is displayed
        resultDiv.appendChild(div);
    }, 3000);
}


//Instance UI
const ui = new UI();



document.addEventListener('DOMContentLoaded', () => {
    ui.fillOptions(); //fill the select with years
})


addEventListeners();
function addEventListeners() {
    const form = document.querySelector('#cotizar-seguro');
    form.addEventListener('submit', quoteInsurance);
}


function quoteInsurance(e) {
    e.preventDefault();

    //Read the brand selected
    const brand = document.querySelector('#marca').value;

    //Read the year selected
    const year = document.querySelector('#year').value;

    //Read the type of coverage
    const type = document.querySelector('input[name="tipo"]:checked').value;

    if (brand === '' || year === '' || type === '') {
        ui.showMessage('Todos los campos son obligatorios', 'error');
        return;
    }

    ui.showMessage('Cotizando...', 'exito');

    //Hide previous quotes
    const results = document.querySelector('#resultado div');
    if(results != null) {
        results.remove();
    }

    //Instantiate insurance
    const insurance = new Insurance(brand, year, type);
    const total = insurance.quoteInsurance();

    //Use the prototype to quote
    ui.showResult(total, insurance);
}