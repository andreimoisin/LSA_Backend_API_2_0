const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
    link: {
        type: String,
        required: true
    },
    index: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        default: "default"
    },
    name: {
        type: String,
        default: function () {
            return "OBJ_" + this.category + "_" + this.index;
        }
    }
});

module.exports = mongoose.model('Image', imageSchema);
