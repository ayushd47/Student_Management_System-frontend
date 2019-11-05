/*
 * noticeClass
 */
var noticeClass = function () {

    /*
     * Variables accessible
     * in the class
     */
    var model = {
        pagination: {
            pagesize: 4,
            skip: 0
        }
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
    this.construct = function () {
        root = $.extend(root, new baseClass(model));
        loaddata();
    };
    var loaddata= function(){
        axios.get('student/notices?pagesize=' + model.pagination.pagesize + '&skip=' + model.pagination.skip).then(function(response){
            var html = ''
            $.each(response.data.data, function (k, item) {
                html += '<div class="col-lg-3 col-md-6 mb-4">'+
                            '<div class="card h-100">'+
                                '<div class="card-body">'+
                                    '<h4 class="card-title">'+ item.Name +'</h4>'+
                                    '<p class="card-text">'+ item.Description +'</p>'+
                                    '<p class="card-text">'+ item.Long_Description +'</p>'+
                                '</div>'+
                                '<div class="card-footer">'+
                                    '<a target="_blank" href="'+ root.baseUrl + '/' + item.File +'" class="btn btn-primary"><i class="fa fa-download"></i> Download</a>'+
                                '</div>'+
                            '</div>'+
                        '</div>'
            })
            var paginationhtml = '';
            if (model.pagination.skip > 0)
                paginationhtml += '<button onclick="page.prev()" class="btn btn-secondary">Prev</button>'
            if (response.data.count > (model.pagination.skip + model.pagination.pagesize))
                paginationhtml += '<button onclick="page.next()" class="btn btn-secondary float-right">Next</button>'
            $("#pagination").html(paginationhtml)
            $("#list").html(html);
        });
    }
    this.prev = function(){
        model.pagination.skip -= model.pagination.pagesize; 
        loaddata();
    }
    this.next = function(){
        model.pagination.skip += model.pagination.pagesize;
        loaddata();
    }
    /*
     * Class instantiated
     */
    this.construct();

};


var page = new noticeClass();