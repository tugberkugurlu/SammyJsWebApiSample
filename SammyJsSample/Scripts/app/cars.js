(function ($, ko) {

    var viewModel = {
            cars: ko.observableArray(),
            selectedCar: ko.observable(),
            isSinglePageActive: ko.observable(false)
        },
        
        app = $.sammy('#main', function () {
        
            // You can just pass the fn and indicate the 
            // element_selector inside the fn.
            // this.element_selector = '#main';

            this.get('#/', function(context) {

                var getCarsContinuation = function (cars) {

                    if (viewModel.cars().length > 0) {
                        viewModel.cars.removeAll();
                    }

                    $.each(cars, function (i, car) {
                        viewModel.cars.push(car);
                        viewModel.isSinglePageActive(false);
                    });
                };

                dataService.getCars()
                    .then(getCarsContinuation)
                    .fail(function () { context.log('dataService.getCars() has failed!'); });
            });

            this.get('#/item/:id', function (context) {

                var id = this.params['id'],
                    getCarContinuation = function (car) {
                        viewModel.selectedCar(car);
                        viewModel.isSinglePageActive(true);
                    };

                dataService.getCar(id)
                    .then(getCarContinuation)
                    .fail(function () { context.log('dataService.getCar() has failed!'); });
            });
        }),

        // http://jsfiddle.net/benfosterdev/h8FjD/
        dataService = (function() {

            var getAllCars = function () {

                var request = $.ajax({
                    url: 'api/cars',
                    type: "GET"
                });

                return request;
            },
            getCar = function (id) {

                var request = $.ajax({
                    url: 'api/cars/' + id,
                    type: "GET"
                });

                return request;
            };

            return {
                getCars: getAllCars,
                getCar: getCar
            };
        }());

    $(function () {
        ko.applyBindings(viewModel);
        app.run('#/');
    });

}(jQuery, ko));