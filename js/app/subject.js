var subjectClass = function(){
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
		{ data: 'SubjectName', title : 'Name' },
		{ data: 'SubjectCode', title : 'Code' },
		{ data: 'Year', title : 'Year' },
		{ data: 'Semister', title : 'Semester' },
		{ data: 'Course',title : 'Course'},
		{ data: null, title : 'Action', 
			render: function ( data, type, row ) {
					return '<a href="javascript:void" onclick="page.edit(\'' + data.Id + '\')">Edit</a> <a href="javascript:void" onclick="page.delete(\'' + data.Id + '\')">Delete</a>';
			} 
		}
    ]
	var url = {
		main: "subjects"
	}

	var beforeSave = function(){
		return true;
	}
	var loadPreEntryData = function(){
		var promises = [axios.get('list/course')]
		if(model.EntryId != null)
			promises.push(axios.get(url.main + '/' + model.EntryId));
		
		axios.all(promises).then(axios.spread(function (response1,response2) {	
			var html = "<option value=''>Select</option>";
			$.each(response1.data, function(k, item){
				html += "<option value='" + item.Id + "'>"+ item.Name +"</option>";
			});
			$("#CourseId").html(html);
			if(model.EntryId != null){		
				$("#Name").val(response2.data.Name);
				$("#CourseId").val(response2.data.CourseId)
				$("#SubjectName").val(response2.data.SubjectName)
				$("#SubjectCode").val(response2.data.SubjectCode)
				$("#Year").val(response2.data.Year)
				$("#Semister").val(response2.data.Semister)
			}
		}));	
	}
	var getSaveModel = function(){
		return {
			Id: model.EntryId,
			Name: $("#Name").val(),
			CourseId: $("#CourseId").val(),
			SubjectName: $("#SubjectName").val(),
			SubjectCode: $("#SubjectCode").val(),
			Year: $("#Year").val(),
			Semister: $("#Semister").val()
		}
	}
	var clearForm = function(){
		$("#Name").val('');
		$("#CourseId").val('');
		$("#SubjectName").val('');
		$("#SubjectCode").val('');
		$("#Year").val('');
		$("#Semister").val('');
	}
	var extraValidationRule = {
	}
	//page specific
    this.construct(); 
};
 
 
var page = new subjectClass();
