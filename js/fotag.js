'use strict';

var imageCollectionModel = null;

var LIST_VIEW = 'LIST_VIEW';
var GRID_VIEW = 'GRID_VIEW';
var RATING_CHANGE = 'RATING_CHANGE';

var STAR_EMPTY = 'icons/star-empty.png';
var STAR_FULL = 'icons/star-full.png';
var GRID_PRESSED = 'icons/grid1.png';
var GRID_RELEASED = 'icons/grid2.png';
var LIST_PRESSED = 'icons/list1.png';
var LIST_RELEASED = 'icons/list2.png';

window.addEventListener('beforeunload', function() {
    var modelModule = createModelModule();
    modelModule.storeImageCollectionModel(imageCollectionModel);
});

window.addEventListener('load', function() {
    var modelModule = createModelModule();
    var viewModule = createViewModule();
    imageCollectionModel = modelModule.loadImageCollectionModel();
    var imageCollectionView = new viewModule.ImageCollectionView();
    var header = document.getElementById('header');
    var content = document.getElementById('content');
    var footer = document.getElementById('footer');

    var toolbar = new viewModule.Toolbar();
    header.appendChild(toolbar.getElement());

    var fileChooser = new viewModule.FileChooser();
    var fileChooserDiv = document.getElementById('choose-file');
    fileChooserDiv.appendChild(fileChooser.getElement());

    imageCollectionView.setImageCollectionModel(imageCollectionModel);
    var imageCollectionDiv = imageCollectionView.getElement();
    content.appendChild(imageCollectionDiv);

    fileChooser.addListener(function(fileChooser, files, eventDate) {
        _.each(
            files,
            function(file) {
                imageCollectionModel.addImageModel(
                    new modelModule.ImageModel(
                        'images/' + file.name,
                        file.lastModifiedDate,
                        '',
                        0
                    ));
            }
        );
        modelModule.storeImageCollectionModel(imageCollectionModel);
    });

    toolbar.addListener(function(toolbar, eventType, eventDate) {

        if (eventType == LIST_VIEW) {
            imageCollectionView.setToView(LIST_VIEW);
        }

        if (eventType == GRID_VIEW) {
            imageCollectionView.setToView(GRID_VIEW);
        }

        if (eventType == RATING_CHANGE) {
            var newImageCollectionModel = new modelModule.ImageCollectionModel();

            var rating = toolbar.getCurrentRatingFilter();

            _.each(
                imageCollectionModel.getImageModels(),
                function(imageModel) {
                    if (imageModel.getRating() >= rating) {
                        newImageCollectionModel.addImageModel(imageModel);
                    }
                }
            );

            imageCollectionView.setImageCollectionModel(newImageCollectionModel);

            _.each(
                imageCollectionView.getImageRenderers(),
                function(imageRenderer) {
                    imageRenderer.setToView(imageCollectionView.getCurrentView());
                }
            );
        }

        imageCollectionDiv = imageCollectionView.getElement();
        content.innerHTML = '';
        content.appendChild(imageCollectionDiv);

    });

    var toolbar_div = document.getElementsByClassName('toolbar')[0];
    var grid_btn = toolbar_div.querySelector('.icon_grid');
    var list_btn = toolbar_div.querySelector('.icon_list');

    grid_btn.addEventListener('click', function() {
        toolbar.setToView(GRID_VIEW);
        grid_btn.src = GRID_PRESSED;
        list_btn.src = LIST_RELEASED;
    });

    list_btn.addEventListener('click', function() {
        toolbar.setToView(LIST_VIEW);
        list_btn.src = LIST_PRESSED;
        grid_btn.src = GRID_RELEASED;
    });

    var close_btn = document.getElementById('close_btn');
    close_btn.addEventListener('click', function() {
        var image_enlarged = document.getElementById('img_enlarged');
        image_enlarged.removeChild(image_enlarged.lastChild);
        image_enlarged.style.display = 'none';
    });

});

function showFilterRate(star, toolbar, stars, event) {
    var rating = toolbar.getCurrentRatingFilter();

    var star_num = parseInt(star.classList[1].substring(5));
    var star_count = 1;

    for(var i=0; i<stars.childNodes.length; i++) {
        var next_star = stars.childNodes[i];
        if (next_star.nodeType == Node.ELEMENT_NODE) {
            if (event == 'mouseover') {
                if (star_count <= star_num) next_star.src = STAR_FULL;
            }

            if (event == 'mouseout') {
                if (star_count > rating) next_star.src = STAR_EMPTY;
            }

            if (event == 'click') {
                if (star_count <= star_num) next_star.src = STAR_FULL;
                else next_star.src = STAR_EMPTY;
            }
            star_count++;
        }
    }
}

function showRate(star, imageModel, imageRendererDiv, event) {
    var rating = imageModel.getRating();
    var stars = imageRendererDiv.querySelector('.star_div');

    if (star == null) {
        _.each(
            stars.childNodes,
            function(star) {
                star.src = STAR_EMPTY;
            }
        );
        return;
    }

    var star_num = parseInt(star.classList[1].substring(4));
    var star_count = 1;

    for(var i=0; i<stars.childNodes.length; i++) {
        var next_star = stars.childNodes[i];
        if (next_star.nodeType == Node.ELEMENT_NODE) {
            if (event == 'mouseover') {
                if (star_count <= star_num) next_star.src = STAR_FULL;
            }

            if (event == 'mouseout') {
                if (star_count > rating) next_star.src = STAR_EMPTY;
            }

            if (event == 'click') {
                if (star_count <= star_num) next_star.src = STAR_FULL;
                else next_star.src = STAR_EMPTY;
            }

            star_count++;
        }
    }
}