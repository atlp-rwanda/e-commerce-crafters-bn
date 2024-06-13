'use strict';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    up(queryInterface, Sequelize) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryInterface.createTable('Vendors', {
                vendorId: {
                    allowNull: false,
                    primaryKey: true,
                    type: Sequelize.STRING,
                    defaultValue: Sequelize.UUIDV4
                },
                userId: {
                    type: Sequelize.STRING,
                    allowNull: false,
                    references: {
                        model: 'Users',
                        key: 'userId'
                    },
                    onDelete: "CASCADE",
                },
                storeName: {
                    type: Sequelize.STRING,
                    allowNull: false
                },
                address: {
                    type: Sequelize.JSONB,
                    allowNull: false
                },
                TIN: {
                    type: Sequelize.BIGINT,
                    allowNull: false,
                    unique: true
                },
                bankAccount: {
                    type: Sequelize.BIGINT,
                    unique: true
                },
                paymentDetails: {
                    type: Sequelize.JSONB
                },
                status: {
                    type: Sequelize.STRING,
                    defaultValue: "pending"
                },
                createdAt: {
                    allowNull: false,
                    type: Sequelize.DATE
                },
                updatedAt: {
                    allowNull: false,
                    type: Sequelize.DATE
                }
            });
        });
    },
    down(queryInterface, Sequelize) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryInterface.dropTable('Vendors');
        });
    }
};
