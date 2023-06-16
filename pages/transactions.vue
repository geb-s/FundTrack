<template>
    <div>
      <v-toolbar color="primary" dark>
        <v-toolbar-title class="my-transactions-header">My Transactions</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn color="primary" class="add-transaction-button" @click="addTransaction">Add Transaction</v-btn>
      </v-toolbar>
  
      <!-- Transactions Table -->
      <v-data-table :headers="tableHeaders" :items="transactions" item-key="id" hide-default-footer>
        <template v-slot:item.date="{ item }">
          {{ formatDate(item.date) }}
        </template>
        <template v-slot:item.actions="{ item }">
          <div class="actions-column">
            <v-btn color="primary" class="edit-button" @click="editTransaction(item)">Edit</v-btn>
            <v-btn color="error" class="remove-button" @click="removeTransaction(item)">Remove</v-btn>
          </div>
        </template>
      </v-data-table>
  
      <!-- Edit Transaction Modal -->
      <v-dialog v-model="isEditMode" max-width="500px">
        <v-card>
          <v-card-title>
            <h3>Edit Transaction</h3>
          </v-card-title>
          <v-card-text>
            <v-form @submit.prevent="saveTransaction">
              <v-text-field v-model="editedTransaction.amount" label="Amount" required type="number"></v-text-field>
              <v-text-field v-model="editedTransaction.description" label="Description" required></v-text-field>
              <v-menu v-model="editedTransaction.dateMenu" :close-on-content-click="false" offset-y min-width="auto">
                <template v-slot:activator="{ on }">
                  <v-text-field v-model="editedTransaction.formattedDate" label="Date" required readonly v-on="on"
                    @click="editedTransaction.dateMenu = true"></v-text-field>
                </template>
                <v-date-picker v-model="editedTransaction.date" no-title @change="setFormattedDate"></v-date-picker>
              </v-menu>
              <v-btn color="primary" type="submit">Save</v-btn>
              <v-btn color="error" @click="cancelEdit">Cancel</v-btn>
            </v-form>
          </v-card-text>
        </v-card>
      </v-dialog>
    </div>
  </template>
  
  <style>
    .my-transactions-header {
      color: white;
    }
  
    .actions-column {
      display: flex;
      justify-content: flex-end;
    }
  
    .edit-button {
      margin-right: 1rem;
    }
  </style>
  
  <script>
    import { TransactionService } from '@/services/TransactionService';
  
    export default {
      data() {
        return {
          transactions: [],
          isEditMode: false,
          editedTransaction: {
            id: null,
            amount: 0,
            description: '',
            date: null,
            dateMenu: false,
            formattedDate: '',
          },
          tableHeaders: [
            { text: 'Description', value: 'description' },
            { text: 'Amount', value: 'amount' },
            { text: 'Date', value: 'date' },
            { text: '', value: 'actions', sortable: false },
          ],
        };
      },
      methods: {
        formatDate(date) {
          const options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' };
          const formattedDate = new Date(date).toLocaleDateString(undefined, options);
          return formattedDate;
        },
        async fetchTransactions() {
          try {
            this.transactions = await TransactionService.getTransactions(this.$apollo);
          } catch (error) {
            console.error('Failed to fetch transactions:', error);
          }
        },
        async addTransaction() {
          // Implement your logic to show the add transaction form or navigate to the add transaction page
          console.log('Add Transaction');
        },
        editTransaction(transaction) {
          this.isEditMode = true;
          this.editedTransaction = { ...transaction };
          this.editedTransaction.date = new Date(transaction.date); // Convert to Date object
          this.editedTransaction.formattedDate = this.formatDate(this.editedTransaction.date); // Assign formatted date
        },
        setFormattedDate() {
          this.editedTransaction.formattedDate = this.formatDate(this.editedTransaction.date);
        },
        async saveTransaction() {
          try {
            const updatedTransaction = await TransactionService.updateTransaction(
              parseInt(this.editedTransaction.id),
              this.editedTransaction,
              this.$apollo
            );
            console.log('Transaction updated:', updatedTransaction);
            this.isEditMode = false;
            // Refresh transactions
            this.fetchTransactions();
          } catch (error) {
            console.error('Failed to save transaction:', error);
          }
        },
        cancelEdit() {
          this.isEditMode = false;
        },
        async removeTransaction(transaction) {
          try {
            await TransactionService.deleteTransaction(transaction.id, this.$apollo);
            console.log('Transaction deleted:', transaction);
            // Refresh transactions
            this.fetchTransactions();
          } catch (error) {
            console.error('Failed to remove transaction:', error);
          }
        },
      },
      mounted() {
        this.fetchTransactions();
      },
    };
  </script>
  