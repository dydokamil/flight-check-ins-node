const { MONGOOSE_CHECK_IN_DEV } = require('./consts')

const mongoose = require('mongoose')
mongoose.connect(MONGOOSE_CHECK_IN_DEV)
