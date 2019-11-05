var userClass = function(){
    var model = {
		entryId : null,
		grid : null
    };
	
    var root = this;
    this.construct = function(){
        root = $.extend(root , new baseClass(model));
		root.showList();	
    };
	this.showList = function(){
		resetPage();
		$("#list").removeClass('hide');
		if(model.grid == null){
			model.grid = $("#grid").DataTable({
				searching:false,
				ordering:false,
				paging: true,
				ajax: function (data, callback, settings ) {
					axios.get(url.main + '?skip=' + data.start + '&pagesize=' +data.length).then(function(response){
						callback({
							data: response.data.data,
							recordsTotal:  response.data.count,
							recordsFiltered:  response.data.count
						});
					});
				},
				serverSide: true,
				columns: gridColumns
			});
		}
		else
			model.grid.ajax.reload(null, false);
	}
	this.showEntry = function(){
		model.EntryId = null;
		showEntryForm();
	}
	showEntryForm = function(){
		resetPage();
		loadPreEntryData();		
		$("#entryForm").removeClass('hide');
	}
	this.edit = function(id){
		model.EntryId = id;
		showEntryForm();
	}
	this.delete = function(id){
		if(confirm("Are you sure you want delete?")){
			axios.delete(url.main + '/' + id).then(function(){
				$.toaster({ message : "Deleted Successfully", title : 'Success', priority : 'success' });
				model.grid.ajax.reload(null, false);
			});
		}
	}
	var resetPage = function(){
		clearForm();		
		$("#list").addClass('hide');
		$("#entryForm").addClass('hide');
	}
	this.submitform = function(e,form){	
		e.preventDefault();		
		$(form).validate({
			rules : extraValidationRule
		});
		if($(form).valid()){
			var data = getSaveModel();
			var mode = data.Id == null ? "create" : "update";
			if(mode == "create"){
				axios.post(url.main,data).then(function(response){
					$.toaster({ message : "Saved Successfully", title : 'Success', priority : 'success' });
					root.showList();
				})
			}
			else{
				axios.patch(url.main,data).then(function(response){
					$.toaster({ message : "Saved Successfully", title : 'Success', priority : 'success' });
					root.showList();
				})
			}
		}
	};
	//page specific
	var gridColumns = [
        { data: 'FullName',title : 'Full Name'},
		{ data: 'UserName', title : 'Username' },
		{ data: null, title : 'Action', 
			render: function ( data, type, row ) {
					return '<a href="javascript:void" onclick="page.edit(\'' + data.Id + '\')">Edit</a> <a href="javascript:void" onclick="page.delete(\'' + data.Id + '\')">Delete</a>';
			} 
		}
    ]
	var url = {
		main: "setup/users"
	}
	var loadPreEntryData = function(){
		var promises = [axios.get('list/role')]
		if(model.EntryId != null)
			promises.push(axios.get(url.main + '/' + model.EntryId));
		
		axios.all(promises).then(axios.spread(function (response1, response2) {
			var html = "<option value=''>Select</option>";
			$.each(response1.data, function(k, item){
				html += "<option value='" + item.Id + "'>"+ item.Name +"</option>";
			});
			$("#RoleId").html(html);
			if(model.EntryId != null){
				$("#UserName").val(response2.data.UserName);
				$("#FullName").val(response2.data.FullName)
				$("#RoleId").val(response2.data.RoleId)
			}
			else{
				$("#PasswordWrapper").removeClass('hide');
			}
		}));
	}
	var getSaveModel = function(){
		return {
			Id: model.EntryId,
			UserName: $("#UserName").val(),
			FullName: $("#FullName").val(),
			RoleId: $("#RoleId").val(),
			Password : $("#Password").val()
		}
	}
	var clearForm = function(){
		$("#UserName").val('');
		$("#FullName").val('');
		$("#RoleId").val('');
		$("#Password").val('');
		$("#ConfirmPassword").val('');
		$("#PasswordWrapper").addClass('hide');
	}
	var extraValidationRule = {
		ConfirmPassword: {
			equalTo: "#Password"
		}
	}
	//page specific
    this.construct();
 
};
 
 
var page = new userClass();
