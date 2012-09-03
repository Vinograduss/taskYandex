/**
 * Создает экземпляр Машины
 * @this {Car}
 * @param {string} manufacturer Производитель
 * @param {string} model Модель
 * @param {number} year Год производство
 */
function Car(manufacturer, model, year) {
    this.manufacturer = manufacturer;
    this.model = model;
    this.year = year || (function(){
		var today = new Date();
		return today.getFullYear();
		}());
	}

// @TODO: реализовать методы вывода информации о машине: 
// console.log('Car: ' + bmw); // Car: BMW X5 2010
// console.log(bmw.getInfo()); // BMW X5 2010
// console.log(bmw.getDetailedInfo()); // Производитель: BMW. Модель: X5. Год: 2010

Car.prototype.toString = function () {
  return this.getInfo();
};

Car.prototype.getInfo =  function() {
	return this.manufacturer + ' ' + this.model + ' ' + this.year;
};

Car.prototype.getDetailedInfo = function() {
	return 'Производитель:' + this.manufacturer + ' Модель:' + this.model +  ' Год:' +  this.year;
};

var bmw = new Car("BMW", "X5", 2010),
    audi = new Car("Audi", "Q5", 2012),
    toyota = new Car("Toyota", "Camry");

/**
 * Создает экземпляр Автосалона
 * @this {CarDealer}
 * @param {string} name Название автосалона
 */
function CarDealer(name) {
    this.name = name;
    this.cars = [];
}

var yandex = new CarDealer('Яндекс.Авто');

// @TODO: реализовать метод добавления машин в автосалон. Предусмотреть возможность добавления одной машины, нескольких машин.

CarDealer.prototype.add = function(namesAvto){
		for(var i=0; i<arguments.length; i++)		
			this.cars.push(arguments[i]);
		
	}
	
	 yandex.add(toyota)
		  .add(bmw, audi);
// @TODO: реализовать метод установки цены на машину
/**
 * Установить цену на машину
 * @param {string} car идентификатор машины
 * @param {string} price стоимость
 */

CarDealer.prototype.setPrice = function(id, price) {  

 this.cars.forEach(function (car) {
    if (car.getInfo() === id) {
	car.setPrice = function(prise){
		this.price = new Price(prise);
	  };
    };
  });      
};

// идентификатор машины составляется следующим образом "производитель модель год"
// стоимость машины может быть задана в двух валютах: йена и евро.
yandex
    .setPrice('BMW X5 2010', '€2000')
    .setPrice('Audi Q5 2012', '€3000')
    .setPrice('Toyota Camry 2012', '?3000');

// @TODO: реализовать вывод списка автомобилей в продаже, с фильтрацией по стране производителю, используя метод getCountry:
function getCountry() {
    switch (this.manufacturer.toLowerCase()) {
        case 'bmw':
    case 'audi':
            return 'Germany';

        case 'toyota':
            return 'Japan';
    }
}

CarDealer.prototype.list = function() {
  
  var tmp = new Array;
  this.cars.forEach(function (car) {        
		tmp.push(car);	
  });
  
  return tmp.toString();
};

CarDealer.prototype.listByCountry = function(country) {
  
  var tmp = new Array;
  this.cars.forEach(function (car) {    
    if(getCountry.call(car) === country) 
		tmp.push(car);	
  });
  
  return tmp.toString();
};

yandex.list(); //BMW X5 2010, Audi Q5 2012, Toyota Camry 2012
yandex.listByCountry('Germany'); //BMW X5 2010, Audi Q5 2012

// @TODO: бонус! выводить список машин с ценой в рублях.
