'use strict';

import mongoose from 'mongoose';

const Schema = mongoose.Schema;

let DevicePacketSchema = new Schema({
        devEui : { type: String, minlength: 16, maxlength: 16, sparse: true },
        devAddr : { type: String, minlength: 8, maxlength: 8, sparse: true },
        packet : {}
    },
    {
        timestamps: true
    });

DevicePacketSchema.index({
    devEui: 'text',
    devAddr: 'text'
});



export default mongoose.model('DevicePacket', DevicePacketSchema);