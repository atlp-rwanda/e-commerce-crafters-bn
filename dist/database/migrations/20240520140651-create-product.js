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
            yield queryInterface.createTable('Products', {
                productId: {
                    allowNull: false,
                    primaryKey: true,
                    type: Sequelize.STRING,
                    defaultValue: Sequelize.UUIDV4
                },
                vendorId: {
                    type: Sequelize.STRING,
                    references: {
                        model: 'Vendors',
                        key: 'vendorId'
                    },
                    onDelete: "CASCADE"
                },
                name: {
                    type: Sequelize.STRING,
                    allowNull: false
                },
                image: {
                    type: Sequelize.STRING,
                    allowNull: false
                },
                description: {
                    type: Sequelize.STRING,
                    allowNull: false
                },
                discount: {
                    type: Sequelize.DOUBLE,
                    allowNull: false
                },
                price: {
                    type: Sequelize.INTEGER,
                    allowNull: false
                },
                quantity: {
                    type: Sequelize.INTEGER
                },
                category: {
                    type: Sequelize.STRING
                },
                createdAt: {
                    allowNull: false,
                    type: Sequelize.DATE
                },
                updatedAt: {
                    allowNull: false,
                    type: Sequelize.DATE
                },
                expiringDate: {
                    allowNull: true,
                    type: Sequelize.DATE
                },
                expired: { allowNull: false, type: Sequelize.BOOLEAN, defaultValue: false },
                available: { allowNull: false, type: Sequelize.BOOLEAN, defaultValue: true },
            });
        });
    },
    down(queryInterface, Sequelize) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryInterface.dropTable('Products');
        });
    }
};
