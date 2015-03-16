'use strict';

/**
 * A function that creates and returns all of the model classes and constants.
  */
function createViewModule() {

    var LIST_VIEW = 'LIST_VIEW';
    var GRID_VIEW = 'GRID_VIEW';
    var RATING_CHANGE = 'RATING_CHANGE';

    /**
     * An object representing a DOM element that will render the given ImageModel object.
     */
    var ImageRenderer = function(imageModel) {
        this.imageModel = imageModel;
        this.view = GRID_VIEW;
        this.imageRendererDiv = null;
    };

    _.extend(ImageRenderer.prototype, {

        /**
         * Returns an element representing the ImageModel, which can be attached to the DOM
         * to display the ImageModel.
         */
        getElement: function() {
            var self = this;
            var imageModelDiv = document.createElement('div');
            imageModelDiv.className = 'imageModelDiv ' + 'image' + this.getImageModel().getID();

            var image_div = document.createElement('div');
            image_div.className = 'image_div';
            var img_template = document.getElementById('image');
            var img_node = document.importNode(img_template.content, true);
            var img = img_node.querySelector('img');
            img.src = this.imageModel.getPath();
            img.alt = 'image';

            img.addEventListener('click', function() {
                var img_enlarged = document.getElementById('img_enlarged');
                var img_copy = document.createElement('img');
                img_copy.src = img.src;
                img_copy.style.height = img_enlarged.style.height;
                img_copy.style.width = img_enlarged.style.width;
                img_enlarged.appendChild(img_copy);
                var html = document.getElementsByTagName('html')[0];
                html.style.zIndex = -1;
                img_enlarged.style.display = 'inline';
            });

            image_div.appendChild(img);

            var meta_div = document.createElement('div');
            meta_div.className = 'meta_div';

            var img_name = document.createElement('p');
            img_name.innerText = this.imageModel.getPath().substring(7);

            var img_date = document.createElement('p');
            img_date.className = 'image_date';
            var date = this.imageModel.getModificationDate();
            img_date.innerText = date.getDate() + "/" + date.getMonth() + "/" + date.getFullYear();

            var star_template = document.getElementById('star_template');
            var star_node = document.importNode(star_template.content, true);

            var i = 1;
            _.each(
                star_node.childNodes,
                function(star) {
                    if (star.nodeType == Node.ELEMENT_NODE) {
                        star.className = 'image_star ' + 'star' + i++;

                        star.addEventListener('mouseover', function() {
                            showRate(star, self.getImageModel(), self.getImageRendererDiv(), 'mouseover');
                        });

                        star.addEventListener('mouseout', function() {
                            showRate(star, self.getImageModel(), self.getImageRendererDiv(), 'mouseout');
                        });

                        star.addEventListener('click', function() {
                            var star_num = parseInt(star.classList[1].substring(4));
                            self.getImageModel().setRating(star_num);
                        });
                    }
                }
            );

            var star_div = document.createElement('div');
            star_div.appendChild(star_node);
            star_div.className = 'star_div';

            meta_div.appendChild(img_name);
            meta_div.appendChild(img_date);
            meta_div.appendChild(star_div);

            var unrate_btn = document.createElement('button');
            unrate_btn.innerHTML = 'unrate';
            meta_div.appendChild(unrate_btn);

            var delete_btn = document.createElement('button');
            delete_btn.innerHTML = 'delete';
            delete_btn.className = 'delete_btn';
            meta_div.appendChild(delete_btn);

            unrate_btn.addEventListener('click', function() {
                self.getImageModel().setRating(0);
            });

            delete_btn.addEventListener('click', function() {
                self.getImageModel().die();
            });

            if (this.getCurrentView() == LIST_VIEW) {
                image_div.style.float = 'left';
                meta_div.style.float = 'left';
            }

            if (this.getCurrentView() == GRID_VIEW) {
                image_div.style.clear = 'both';
                meta_div.style.clear = 'both';
            }

            imageModelDiv.appendChild(image_div);
            imageModelDiv.appendChild(meta_div);

            this.setImageRendererDiv(imageModelDiv);
            var star = star_div.querySelector('.star'+this.getImageModel().getRating());
            showRate(star, this.getImageModel(), this.getImageRendererDiv(), 'click');

            return imageModelDiv;
        },

        /**
         * Returns the ImageModel represented by this ImageRenderer.
         */
        getImageModel: function() {
            return this.imageModel;
        },

        /**
         * Sets the ImageModel represented by this ImageRenderer, changing the element and its
         * contents as necessary.
         */
        setImageModel: function(imageModel) {
            this.imageModel = imageModel;
        },

        /**
         * Changes the rendering of the ImageModel to either list or grid view.
         * @param viewType A string, either LIST_VIEW or GRID_VIEW
         */
        setToView: function(viewType) {
            this.view = viewType;
        },

        /**
         * Returns a string of either LIST_VIEW or GRID_VIEW indicating which view type it is
         * currently rendering.
         */
        getCurrentView: function() {
            return this.view;
        },

        setImageRendererDiv: function(imageRendererDiv) {
            this.imageRendererDiv = imageRendererDiv;
        },

        getImageRendererDiv: function() {
            return this.imageRendererDiv;
        }
    });

    /**
     * A factory is an object that creates other objects. In this case, this object will create
     * objects that fulfill the ImageRenderer class's contract defined above.
     */
    var ImageRendererFactory = function() {
    };

    _.extend(ImageRendererFactory.prototype, {

        /**
         * Creates a new ImageRenderer object for the given ImageModel
         */
        createImageRenderer: function(imageModel) {
            return new ImageRenderer(imageModel);
        }
    });

    /**
     * An object representing a DOM element that will render an ImageCollectionModel.
     * Multiple such objects can be created and added to the DOM (i.e., you shouldn't
     * assume there is only one ImageCollectionView that will ever be created).
     */
    var ImageCollectionView = function() {
        this.imageCollectionModel = null;
        this.imageRenderers = [];
        this.imageRendererFactory = new ImageRendererFactory();
        this.view = GRID_VIEW;
    };

    _.extend(ImageCollectionView.prototype, {
        /**
         * Returns an element that can be attached to the DOM to display the ImageCollectionModel
         * this object represents.
         */
        getElement: function() {
            var self = this;
            var collection_div = document.createElement('div');
            collection_div.className = 'collection_div';

            _.each(
                this.getImageRenderers(),
                function(imageRenderer) {
                    var newImageElement = imageRenderer.getElement();
                    if (self.getCurrentView() == LIST_VIEW) {
                        newImageElement.style.clear = 'both';
                        newImageElement.style.float = 'none';
                    }
                    if (self.getCurrentView() == GRID_VIEW) {
                        newImageElement.style.float = 'left';
                        newImageElement.style.clear = 'none';
                    }
                    collection_div.appendChild(newImageElement);
                }
            );

            return collection_div;
        },

        /**
         * Gets the current ImageRendererFactory being used to create new ImageRenderer objects.
         */
        getImageRendererFactory: function() {
            return this.imageRendererFactory;
        },

        /**
         * Sets the ImageRendererFactory to use to render ImageModels. When a *new* factory is provided,
         * the ImageCollectionView should redo its entire presentation, replacing all of the old
         * ImageRenderer objects with new ImageRenderer objects produced by the factory.
         */
        setImageRendererFactory: function(imageRendererFactory) {
            this.imageRendererFactory = imageRendererFactory;
            var newImageRenderers = [];
            var self = this;

            _.each(
                this.getImageRenderers(),
                function(imageRenderer) {
                    var imageModel = imageRenderer.getImageModel();
                    var newImageRenderer = self.getImageRendererFactory().createImageRenderer(imageModel);
                    newImageRenderers.push(newImageRenderer);
                }
            );

            this.setImageRenderers(newImageRenderers);
        },

        /**
         * Returns the ImageCollectionModel represented by this view.
         */
        getImageCollectionModel: function() {
            return this.imageCollectionModel;
        },

        /**
         * Sets the ImageCollectionModel to be represented by this view. When setting the ImageCollectionModel,
         * you should properly register/unregister listeners with the model, so you will be notified of
         * any changes to the given model.
         */
        setImageCollectionModel: function(imageCollectionModel) {
            this.imageCollectionModel = imageCollectionModel;
            this.setImageRenderers([]);
            var self = this;

            imageCollectionModel.addListener(function(eventType, imageModelCollection, imageModel, eventDate) {

                if (eventType == IMAGE_ADDED_TO_COLLECTION_EVENT) {
                    var imageRenderer = self.imageRendererFactory.createImageRenderer(imageModel);
                    self.addImageRenderer(imageRenderer);
                    var collection_div = document.getElementsByClassName('collection_div');
                    var newImageElement = imageRenderer.getElement();
                    collection_div[0].appendChild(newImageElement);
                }

                if (eventType == IMAGE_META_DATA_CHANGED_EVENT) {
                    for(var i=0; i<self.getImageRenderers().length; i++) {
                        var renderer = self.getImageRenderers()[i];
                        if (renderer.getImageModel() == imageModel) {
                            var imageID = renderer.getImageModel().getID();
                            var imageRendererDiv = renderer.getImageRendererDiv();
                            break;
                        }
                    }

                    var rating = imageModel.getRating();
                    var star = imageRendererDiv.querySelector('.star'+rating);
                    showRate(star, imageModel, imageRendererDiv, 'click');
                    var date = imageModel.getModificationDate();
                    var img_date = document.getElementsByClassName('image'+imageID)[0].querySelector('.img_date');
                    img_date.innerText = date.getDate() + "/" + date.getMonth() + "/" + date.getFullYear();
                }

                if (eventType == IMAGE_REMOVED_FROM_COLLECTION_EVENT) {
                    for(i=0; i<self.getImageRenderers().length; i++) {
                        renderer = self.getImageRenderers()[i];
                        if (renderer.getImageModel() == imageModel) {
                            imageID = renderer.getImageModel().getID();
                            _.without(self.getImageRenderers(), renderer);
                            break;
                        }
                    }
                    var imageModelDiv = document.getElementsByClassName('image'+imageID)[0];
                    imageModelDiv.style.display = 'none';
                }
            });

            _.each(
                this.getImageCollectionModel().getImageModels(),
                function(imageModel) {
                    var imageRenderer = self.imageRendererFactory.createImageRenderer(imageModel);
                    self.addImageRenderer(imageRenderer);
                }
            );
        },

        /**
         * Changes the presentation of the images to either grid view or list view.
         * @param viewType A string of either LIST_VIEW or GRID_VIEW.
         */
        setToView: function(viewType) {
            this.view = viewType;

            _.each(
                this.getImageRenderers(),
                function(imageRenderer) {
                    imageRenderer.setToView(viewType);
                }
            );
        },

        /**
         * Returns a string of either LIST_VIEW or GRID_VIEW indicating which view type is currently
         * being rendered.
         */
        getCurrentView: function() {
            return this.view;
        },

        /**
         * Adds a new ImageRenderer object to the ImageRenderers array.
         * @param imageRenderer
         */
        addImageRenderer: function(imageRenderer) {
           this.imageRenderers.push(imageRenderer);
        },

        /**
         * Removes an ImageRenderer from the ImageRenderers array
         * @param imageRenderer
         */
        removeImageRenderer: function(imageRenderer) {
            _.without(this.imageRenderers, imageRenderer);
        },

        /**
         * Returns the ImageRenderers array
         * @returns {Array}
         */
        getImageRenderers: function() {
           return this.imageRenderers;
        },

        /**
         * Sets the ImageRenderers array
         * @param imageRenderers
         */
        setImageRenderers: function(imageRenderers) {
            this.imageRenderers = imageRenderers;
        }
    });

    /**
     * An object representing a DOM element that will render the toolbar to the screen.
     */
    var Toolbar = function() {
        this.view = GRID_VIEW;
        this.listeners = [];
        this.rating = 0;
    };

    _.extend(Toolbar.prototype, {
        /**
         * Returns an element representing the toolbar, which can be attached to the DOM.
         */
        getElement: function() {
            var self = this;
            var view_template = document.getElementById('view_template');
            var star_template = document.getElementById('star_template');
            var view_node = document.importNode(view_template.content, true);
            var star_node = document.importNode(star_template.content, true);
            var toolbar = document.createElement('div');
            var view_div = document.createElement('div');
            var star_div = document.createElement('div');
            view_div.appendChild(view_node);
            star_div.appendChild(star_node);
            view_div.className = 'view_bar';
            star_div.className = 'star_bar';

            var star_count = 1;
            for(var i=0; i<star_div.childNodes.length; i++) {
                if (star_div.childNodes[i].nodeType == Node.ELEMENT_NODE) {
                    star_div.childNodes[i].className += ' fstar' + star_count++;
                    var star = star_div.childNodes[i];

                    star.addEventListener('mouseover', function() {
                        showFilterRate(this, self, star_div, 'mouseover');
                    });

                    star.addEventListener('mouseout', function() {
                        showFilterRate(this, self, star_div, 'mouseout');
                    });

                    star.addEventListener('click', function() {
                        self.setRatingFilter(parseInt(this.classList[1].substring(5)));
                        showFilterRate(this, self, star_div, 'click');
                    });
                }
            }

            toolbar.appendChild(view_div);
            var span = document.createElement('span');
            span.className = 'span_filter';
            span.innerText = "Filter by: ";
            toolbar.appendChild(span);
            var clear_btn = document.createElement('button');
            clear_btn.innerHTML = 'clear';
            clear_btn.className = 'clear_btn';

            clear_btn.addEventListener('click', function() {
                _.each(
                    star_div.childNodes,
                    function(star) {
                        star.src = STAR_EMPTY;
                    }
                );
                self.setRatingFilter(0);
            });
            toolbar.appendChild(clear_btn);
            toolbar.appendChild(star_div);
            toolbar.className = 'toolbar';
            return toolbar;
        },

        /**
         * Registers the given listener to be notified when the toolbar changes from one
         * view type to another.
         * @param listener_fn A function with signature (toolbar, eventType, eventDate), where
         *                    toolbar is a reference to this object, eventType is a string of
         *                    either, LIST_VIEW, GRID_VIEW, or RATING_CHANGE representing how
         *                    the toolbar has changed (specifically, the user has switched to
         *                    a list view, grid view, or changed the star rating filter).
         *                    eventDate is a Date object representing when the event occurred.
         */
        addListener: function(listener_fn) {
            this.listeners.push(listener_fn);
        },

        /**
         * Removes the given listener from the toolbar.
         */
        removeListener: function(listener_fn) {
            _.without(this.listeners, listener_fn);
        },

        /**
         * Sets the toolbar to either grid view or list view.
         * @param viewType A string of either LIST_VIEW or GRID_VIEW representing the desired view.
         */
        setToView: function(viewType) {
            this.view = viewType;
            var self = this;

            _.each(
                this.listeners,
                function(listener_fn) {
                    listener_fn(self, viewType, new Date());
                }
            );
        },

        /**
         * Returns the current view selected in the toolbar, a string that is
         * either LIST_VIEW or GRID_VIEW.
         */
        getCurrentView: function() {
            return this.view;
        },

        /**
         * Returns the current rating filter. A number in the range [0,5], where 0 indicates no
         * filtering should take place.
         */
        getCurrentRatingFilter: function() {
            return this.rating;
        },

        /**
         * Sets the rating filter.
         * @param rating An integer in the range [0,5], where 0 indicates no filtering should take place.
         */
        setRatingFilter: function(rating) {
            this.rating = rating;
            var self = this;

            _.each(
                this.listeners,
                function(listener_fn) {
                    listener_fn(self, RATING_CHANGE, new Date());
                }
            );
        }
    });

    /**
     * An object that will allow the user to choose images to display.
     * @constructor
     */
    var FileChooser = function() {
        this.listeners = [];
        this._init();
    };

    _.extend(FileChooser.prototype, {
        // This code partially derived from: http://www.html5rocks.com/en/tutorials/file/dndfiles/
        _init: function() {
            var self = this;
            this.fileChooserDiv = document.createElement('div');
            var fileChooserTemplate = document.getElementById('file-chooser');
            this.fileChooserDiv.appendChild(document.importNode(fileChooserTemplate.content, true));
            var fileChooserInput = this.fileChooserDiv.querySelector('.files-input');
            fileChooserInput.addEventListener('change', function(evt) {
                var files = evt.target.files;
                var eventDate = new Date();
                _.each(
                    self.listeners,
                    function(listener_fn) {
                        listener_fn(self, files, eventDate);
                    }
                );
            });
        },

        /**
         * Returns an element that can be added to the DOM to display the file chooser.
         */
        getElement: function() {
            return this.fileChooserDiv;
        },

        /**
         * Adds a listener to be notified when a new set of files have been chosen.
         * @param listener_fn A function with signature (fileChooser, fileList, eventDate), where
         *                    fileChooser is a reference to this object, fileList is a list of files
         *                    as returned by the File API, and eventDate is when the files were chosen.
         */
        addListener: function(listener_fn) {
            if (!_.isFunction(listener_fn)) {
                throw new Error("Invalid arguments to FileChooser.addListener: " + JSON.stringify(arguments));
            }

            this.listeners.push(listener_fn);
        },

        /**
         * Removes the given listener from this object.
         * @param listener_fn
         */
        removeListener: function(listener_fn) {
            if (!_.isFunction(listener_fn)) {
                throw new Error("Invalid arguments to FileChooser.removeListener: " + JSON.stringify(arguments));
            }
            this.listeners = _.without(this.listeners, listener_fn);
        }
    });

    // Return an object containing all of our classes and constants
    return {
        ImageRenderer: ImageRenderer,
        ImageRendererFactory: ImageRendererFactory,
        ImageCollectionView: ImageCollectionView,
        Toolbar: Toolbar,
        FileChooser: FileChooser,

        LIST_VIEW: LIST_VIEW,
        GRID_VIEW: GRID_VIEW,
        RATING_CHANGE: RATING_CHANGE
    };
}