/*
 * baseClass
 */
var baseClass = function(options){
 
    /*
     * Variables accessible
     * in the class
     */
    var model = {
		requireLogin : true
	};
	this.baseUrl = 'http://localhost:3000';
	this.apiBaseUrl = this.baseUrl +  '/api/v1';
	this.constant = {
		STUDENT_INFO : 'STUDENT_INFO'
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
	 
    this.construct = function(options){
        $.extend(model , options);
		
		//axios config
		axios.defaults.baseURL = root.apiBaseUrl;
		// Add a request interceptor
		axios.interceptors.request.use(function (config) {
			NProgress.start();
			var userInfo = root.getUserInfo();
			if(userInfo != null)
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
			if(error.response.status == 401){
				root.logout()
			}
			else if(error.response.status == 422){
				$.toaster({ message : "Validation error", title : 'Error', priority : 'danger' });
			}
			else{
				$.toaster({ message : error.response.data.message, title : 'Error', priority : 'danger' });
			}			
			return Promise.reject(error);
		});
		var userInfo = root.getUserInfo();
		if(model.requireLogin){
			if(userInfo == null)
				window.location.href = '/student/login.html'
		}
    };
	this.getUserInfo = function(){
		return JSON.parse(localStorage.getItem(root.constant.STUDENT_INFO))
	};
	this.logout = function(){
		localStorage.removeItem(root.constant.STUDENT_INFO);
		window.location.href = '/index.html'
	}
    /*                                                  
     * Private method                                   
     * Can only be called inside class                  
     */ 
    var loadheaderfooter = function() {   
		if($("#studentheader").length == 1){      
			$("#studentheader").load( "/shared/studentheader.html",function(){
				if(root.getUserInfo() == null)
					$(".no-login-menu").removeClass('hide')
				else
					$(".loggedinmenu").removeClass('hide')
				$(".nav-item").filter(function(){return $(this).find('a').attr('href') === window.location.pathname}).addClass('active');
			});
		}		
		if($("#studentfooter").length == 1)
			$( "#studentfooter" ).load( "/shared/studentfooter.html" );    
    };                                                  
	
	loadheaderfooter();
    /*
     * Pass options when class instantiated
     */
    this.construct(options);
 
};
