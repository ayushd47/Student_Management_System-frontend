/*
 * galleryClass
 */
var galleryClass = function () {

    /*
     * Variables accessible
     * in the class
     */
    var model = {
        requireLogin: false,
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
        axios.get('public/galleries?pagesize=' + model.pagination.pagesize + '&skip=' + model.pagination.skip).then(function(response){
            var html = ''
            $.each(response.data.data, function (k, item) {
                html += '<div class="col-lg-3 col-md-6 mb-4">'+
                            '<div class="card h-100">'+
                                '<a target="_blank" href="'+ root.baseUrl + '/' + item.Image +'"><img class="card-img-top" src="'+ root.baseUrl + '/' + item.Image +'" alt=""/></a>' +
                                '<div class="card-body">'+
                                    '<h4 class="card-title">'+ item.Name +'</h4>'+
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


var page = new galleryClass();