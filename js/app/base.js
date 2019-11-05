/*
 * baseClass
 */
var baseClass = function (options) {

	/*
	 * Variables accessible
	 * in the class
	 */
	var model = {
		requireLogin: true
	};
	this.baseUrl = 'http://localhost:3000';
	this.apiBaseUrl = this.baseUrl + '/api/v1';
	this.constant = {
		USER_INFO: 'USER_INFO'
	}
	/*
	 * Can access this.method
	 * inside other methods using
	 * root.method()
	 */
	var root = this;

	/*
	 * Constructor
	 */

	this.construct = function (options) {
		$.extend(model, options);

		//axios config
		axios.defaults.baseURL = root.apiBaseUrl;
		// Add a request interceptor
		axios.interceptors.request.use(function (config) {
			NProgress.start();
			var userInfo = root.getUserInfo();
			if (userInfo != null)
				config.headers['Authorization'] = 'Bearer ' + userInfo.token;
			return config;
		}, function (error) {
			return Promise.reject(error);
		});

		// Add a response interceptor
		axios.interceptors.response.use(function (response) {
			NProgress.done();
			return response;
		}, function (error) {
			NProgress.done();
			if (error.response.status == 401) {
				root.logout()
			} else if (error.response.status == 422) {
				$.toaster({
					message: "Validation error",
					title: 'Error',
					priority: 'danger'
				});
			} else {
				$.toaster({
					message: error.response.data.message,
					title: 'Error',
					priority: 'danger'
				});
			}
			return Promise.reject(error);
		});
		var userInfo = root.getUserInfo();
		if (model.requireLogin) {
			if (userInfo == null)
				window.location.href = '/login.html'
		}
		
		// Close any open menu accordions when window is resized below 768px
		$(window).resize(function () {
			if ($(window).width() < 768) {
				$('.sidebar .collapse').collapse('hide');
			};
		});
	};
	this.getUserInfo = function () {
		return JSON.parse(localStorage.getItem(root.constant.USER_INFO))
	};
	this.logout = function () {
		localStorage.removeItem(root.constant.USER_INFO);
		window.location.href = '/login.html'
	}
	/*                                                  
	 * Private method                                   
	 * Can only be called inside class                  
	 */
	var loadheaderfooter = function () {
		$("#header").load("/shared/header.html");
		$("#sidebar").load("/shared/sidebar.html",function(){
			// Toggle the side navigation
			$("#sidebarToggle, #sidebarToggleTop").on('click', function (e) {
				$("body").toggleClass("sidebar-toggled");
				$(".sidebar").toggleClass("toggled");
				if ($(".sidebar").hasClass("toggled")) {
					$('.sidebar .collapse').collapse('hide');
				};
			});
		});
		$("#footer").load("/shared/footer.html");
	};

	loadheaderfooter();
	/*
	 * Pass options when class instantiated
	 */
	this.construct(options);

};