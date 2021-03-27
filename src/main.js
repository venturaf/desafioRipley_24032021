require('dotenv').config(); // VARIABLES DE ENTORNO

const express = require('express'); // HTTP EXPRESS
const mongoose = require('mongoose'); // ODM MONGO

const mongoConnect = require("./infrastructure/mongo/index")(mongoose);
const { userSchema } = require('./infrastructure/mongo/schema/user.schema')(mongoConnect.Schema)
const { balanceSchema } = require('./infrastructure/mongo/schema/balance.schema')(mongoConnect.Schema)
const { historySchema } = require('./infrastructure/mongo/schema/history.schema')(mongoConnect.Schema)

const mongoRepository = {
    model: mongoConnect.model,
    UserRepository: {userSchema},
    BalanceRepository:{balanceSchema,},
    HistoryRepository:{historySchema,}
}

const startServer = require("./infrastructure/web/index")(express, mongoRepository);
