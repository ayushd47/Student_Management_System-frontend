var noticeClass = function(){
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
			if(!beforeSave())
				return;
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
		{ data: 'Name', title : 'Name' },
		{ data: 'Description', title : 'Description' },
		{ data: null, title : 'Action', 
			render: function ( data, type, row ) {
					return '<a href="javascript:void" onclick="page.edit(\'' + data.Id + '\')">Edit</a> <a href="javascript:void" onclick="page.delete(\'' + data.Id + '\')">Delete</a>';
			} 
		}
    ]
	var url = {
		main: "notices"
	}
	var file = null;
	var beforeSave = function(){
		if(file == null){
			$.toaster({ message : "Please upload file", title : 'Error', priority : 'danger' });
			return false;
		}
		return true;
	}
	var loadPreEntryData = function(){
		var promises = []
		if(model.EntryId != null){
			promises.push(axios.get(url.main + '/' + model.EntryId));
		
		axios.all(promises).then(axios.spread(function (response2) {			
				$("#Name").val(response2.data.Name)
				$("#Description").val(response2.data.Description)
				$("#Long_Description").val(response2.data.Long_Description)
				file = response2.data.File		
				$("#preview").attr("href", root.baseUrl + '/' + file);
				$("#preview").removeClass('hide');			
		}));
	}	
	}
	var getSaveModel = function(){
		return {
			Id: model.EntryId,
			Name: $("#Name").val(),
			Description: $("#Description").val(),
			Long_Description: $("#Long_Description").val(),
			File: file
		}
	}
	var clearForm = function(){
		$("#Name").val('');
		$("#Description").val('');
		$("#Long_Description").val('');
		File = null;
		$("#preview").addClass('hide');
		$('input[type=file]').val('');
	}
	var extraValidationRule = {
	}
	this.fileupload = function(el){
		var formData = new FormData();
		formData.append('File', el.files[0]);
		axios.post( 'notices/upload',
		formData,
		{
			headers: {
				'Content-Type': 'multipart/form-data'
			}
		}
		).then(function(response){
			file = response.data.path.replace('public/','').replace('public\\','')
			$("#preview").attr("href", root.baseUrl + '/' + file);
			$("#preview").removeClass('hide');
		});
	}
	//page specific
    this.construct(); 
};
 
 
var page = new noticeClass();
