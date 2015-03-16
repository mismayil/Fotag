'use strict';

var expect = chai.expect;

describe('ImageModel tests', function() {

    it('Listener unit test 1 for ImageModel', function() {
        var modelModule = createModelModule();
        var imageModel = new modelModule.ImageModel("", new Date(), "", 0);

        var firstListener = sinon.spy();
        imageModel.addListener(firstListener);

        imageModel.setRating(2);
        expect(firstListener.called, "imageModel listener should be called").to.be.ok;
        expect(firstListener.args[0][0], 'Argument verification 1').to.equal(imageModel);

        var secondListener = sinon.spy();
        imageModel.addListener(secondListener);

        imageModel.setRating(0);

        expect(firstListener.callCount, 'ImageModel first listener should have been called twice').to.equal(2);
        expect(secondListener.called, "ImageModel second listener should have been called").to.be.ok;

    });

    it('Listener unit test 2 for ImageModel', function() {
        var modelModule = createModelModule();
        var imageModel = new modelModule.ImageModel("", new Date(), "", 0);

        var firstListener = sinon.spy();
        imageModel.addListener(firstListener);

        imageModel.die();
        expect(firstListener.called, "imageModel listener should be called").to.be.ok;
        expect(firstListener.args[0][0], 'Argument verification 1').to.equal(imageModel);

        var secondListener = sinon.spy();
        imageModel.addListener(secondListener);

        imageModel.setCaption("Caption");

        expect(firstListener.callCount, 'ImageModel first listener should have been called twice').to.equal(2);
        expect(secondListener.called, "ImageModel second listener should have been called").to.be.ok;

    });
});

describe('ImageCollectionModel tests', function() {

    it('Listener unit test 1 for ImageCollectionModel', function() {
        var modelModule = createModelModule();
        var imageCollectionModel = new modelModule.ImageCollectionModel();
        var imageModel = new modelModule.ImageModel("",new Date(), "", 2);

        var firstListener = sinon.spy();
        imageCollectionModel.addListener(firstListener);

        imageCollectionModel.addImageModel(imageModel);
        expect(firstListener.called, "imageCollectionModel listener should be called").to.be.ok;
        expect(firstListener.args[0][0], 'Argument verification 1').to.equal(IMAGE_ADDED_TO_COLLECTION_EVENT);

        var secondListener = sinon.spy();
        imageCollectionModel.addListener(secondListener);

        imageCollectionModel.removeImageModel(imageModel);

        expect(firstListener.callCount, 'ImageCollectionModel first listener should have been called twice').to.equal(2);
        expect(secondListener.called, "ImageCollectionModel second listener should have been called").to.be.ok;
        expect(secondListener.args[0][0], 'Argument verification 2').to.equal(IMAGE_REMOVED_FROM_COLLECTION_EVENT);

    });

    it('Listener unit test 2 for ImageCollectionModel', function() {
        var modelModule = createModelModule();
        var imageCollectionModel = new modelModule.ImageCollectionModel();
        var imageModel = new modelModule.ImageModel("",new Date(), "", 2);

        var imageModelListener = sinon.spy();
        imageModel.addListener(imageModelListener);

        var imageCollectionModelListener = sinon.spy();
        imageCollectionModel.addListener(imageCollectionModelListener);

        imageCollectionModel.addImageModel(imageModel);
        expect(imageCollectionModelListener.called, "imageCollectionModel listener should be called").to.be.ok;
        expect(imageCollectionModelListener.args[0][0], 'Argument verification 1').to.equal(IMAGE_ADDED_TO_COLLECTION_EVENT);

        imageModel.setRating(3);
        expect(imageModelListener.called, "imageModel listener should be called").to.be.ok;
        expect(imageModelListener.args[0][0], 'Argument verification 1').to.equal(imageModel);

        expect(imageCollectionModelListener.called, "imageCollectionModel listener should be called").to.be.ok;
        expect(imageCollectionModelListener.callCount, 'ImageModelCollection Listener should have been called twice').to.equal(2);
        expect(imageCollectionModelListener.args[1][0], 'Argument verification 2').to.equal(IMAGE_META_DATA_CHANGED_EVENT);

    });
});

describe('Toolbar tests', function() {

    it('Listener unit test 1 for Toolbar', function() {
        var viewModule = createViewModule();
        var toolbar = new viewModule.Toolbar();

        var firstListener = sinon.spy();
        toolbar.addListener(firstListener);

        toolbar.setToView(LIST_VIEW);
        expect(firstListener.called, "toolbar listener should be called").to.be.ok;
        expect(firstListener.args[0][0], 'Argument verification 1').to.equal(toolbar);
        expect(firstListener.args[0][1], 'Argument verification 1').to.equal(LIST_VIEW);

        var secondListener = sinon.spy();
        toolbar.addListener(secondListener);

        toolbar.setRatingFilter(3);

        expect(firstListener.callCount, 'toolbar first listener should have been called twice').to.equal(2);
        expect(secondListener.called, "toolbar second listener should have been called").to.be.ok;
        expect(secondListener.args[0][0], 'Argument verification 2').to.equal(toolbar);
        expect(secondListener.args[0][1], 'Argument verification 2').to.equal(RATING_CHANGE);

    });
});
