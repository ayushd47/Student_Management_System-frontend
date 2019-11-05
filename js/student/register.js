/*
 * registerClass
 */
var registerClass = function(){
 
    /*
     * Variables accessible
     * in the class
     */
    var model = {
        requireLogin : false
    };
 
    /*
     * Can access this.method
     * inside other methods using
     * root.method()
     */
    var root = this;
    
    this.submitform = function(e,form){	
		e.preventDefault();		
		$(form).validate({
			rules : {
                ConfirmPassword: {
                    equalTo: "#Password"
                }
            }
		});
		if($(form).valid()){
			var data = getSaveModel();
            axios.post('public/student/register',data).then(function(response){
                $.toaster({ message : "You are registered successfully", title : 'Success', priority : 'success' });                
                clearForm();
            })
		}
    };
    
    /*
     * Constructor
     */
    this.construct = function(){
        root = $.extend(root , new baseClass(model));
    };
    var getSaveModel = function(){
		return {
			UserName: $("#UserName").val(),
			FullName: $("#FullName").val(),
			Password : $("#Password").val()
		}
    }
    var clearForm = function(){
		$("#UserName").val('');
		$("#FullName").val('');
		$("#Password").val('');
		$("#ConfirmPassword").val('');
	}
    /*
     * Class instantiated
     */
    this.construct();
 
};
 
 
var page = new registerClass();
