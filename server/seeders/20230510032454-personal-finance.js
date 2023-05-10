"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "accounts",
      [
        {
          category: "Asset",
          name: "Checking Account",
          account_number: "1234567890",
          description: "Primary checking account",
          debit: false,
          balance: 5000,
          created_by: 1,
          created_at: new Date(),
          read_at: null,
          updated_at: new Date(),
          deleted_at: null,
        },
        {
          category: "Liability",
          name: "Credit Card",
          account_number: "0987654321",
          description: "Personal credit card",
          debit: true,
          balance: 1000,
          created_by: 1,
          created_at: new Date(),
          read_at: null,
          updated_at: new Date(),
          deleted_at: null,
        },
        {
          category: "Revenue",
          name: "Sales",
          account_number: "1111111111",
          description: "Sales revenue",
          debit: false,
          balance: 0,
          created_by: 1,
          created_at: new Date(),
          read_at: null,
          updated_at: new Date(),
          deleted_at: null,
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("accounts", null, {});
  },
};
