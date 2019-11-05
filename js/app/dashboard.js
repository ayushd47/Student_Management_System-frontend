/*
 * dashboardClass
 */
var dashboardClass = function(){
 
    /*
     * Variables accessible
     * in the class
     */
    var model = {
    };
 
    /*
     * Can access this.method
     * inside other methods using
     * root.method()
     */
    var root = this;
 
    /*
     * Constructor
     */
    this.construct = function(){
        root = $.extend(root , new baseClass(model));
		axios.get('dashboard');//only to check session	
    };
 
    /*
     * Class instantiated
     */
    this.construct();
 
};
 
 
var page = new dashboardClass();
