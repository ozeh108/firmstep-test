var productsFunction = (function($) {

	var items = [];
	var activeFilter = [];
	var checked;
	var group;
	var value;

	return {
		cacheDom: function() {
			this.$element = $('#products-list');
			this.template = this.$element.find('#products-template').html();
			this.$filtersForm = $('#filters');
			this.$button = this.$filtersForm.find('button');
			this.$checkboxes = this.$filtersForm.find('[type="checkbox"]'); 
			this.$checkboxes.each(function (i, item) {
				if (activeFilter[$(this).prop("name")] == undefined) {
					activeFilter[$(this).prop("name")] = [];
				}
			});
		},
		button: $('#filters button').on('click', function (event) {
			event.preventDefault();
			productsFunction.$checkboxes.removeAttr('checked');
			productsFunction.render(items);
			productsFunction.bindEvents();
		}),
		render: function(phones) {
			var data = {
				products: phones
			};
			if (phones.length == 0) {
				this.$element.html("<h1>No phones matching the filter, sorry :(</h1>");
			} else {
				this.$element.html(Mustache.render(this.template,data));
			}
		},
		init: function() {
			this.cacheDom();
			$.ajax({
				url: "products.json",
				success: function (result) {
					items = result;
					productsFunction.render(items);
					productsFunction.bindEvents();
				}
			});
		},
		bindEvents: function () {
			this.$checkboxes.on('change', function () {
				productsFunction.updateActiveFilter();
			})
		},
		updateActiveFilter: function () {
			productsFunction.resetActiveFilter();

			this.$checkboxes.each(function () {
				checked = $(this).prop("checked");
				if (checked) {
					group = $(this).prop("name");
					value = $(this).prop("value").toString();
					activeFilter[group].push(value);
				}
			});
			productsFunction.filter();
		},
		resetActiveFilter: function () {
			for (var prop in activeFilter) {
				activeFilter[prop] = [];
			}
		},
		filter: function () {
			var updated = _.filter(items, function (obj) {
				var testArray = [];
				for (var prop in activeFilter) {
					isInArray = activeFilter[prop].length == 0 || activeFilter[prop].includes(obj.specs[prop].toString());
					testArray.push(isInArray);
				}
				return testArray.every(function (bool) {
					return bool == true;
				});
			});
			productsFunction.render(updated);
		}
	}
	
})(jQuery)

productsFunction.init();