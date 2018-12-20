export default `
<template>
    <h2>{{header}}</h2>
    <form class="popup-form" action="" method="" enctype="multipart/form-data">
        <label class="w50">
            <span>Title *</span>
            <input type="text" name="title" value="{{title}}" required>
        </label>
        <label class="w50">
            <span>Author *</span>
            <input type="text" name="author" value="{{author}}" required>
        </label>
        <label class="w100">
            <span>Description</span>
            <textarea name="description" rows="4">{{description}}</textarea>
        </label>
        <label class="w100">
            <span>Keywords</span>
            <input type="text" name="keywords" value="{{keywords}}">
        </label>
        <label class="w100">
            <span>Image</span>
            <input type="file" name="image" value="{{image}}">
        </label>
        <label class="w33">
            <span>Price *</span>
            <input type="number" name="price" min="0" value="{{price}}" required>
        </label>
        <label class="w66">
            <span>Publish</span>
            <input type="datetime-local" name="published_at" value="{{published_at}}">
        </label>
        <div class="popup-buttons w100"></div>
        <div class="popup-message"></div>
    </form>
</template>`;
