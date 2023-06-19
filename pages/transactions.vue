<template>
  <div>
    <v-toolbar color="primary" dark>
      <v-toolbar-title class="my-transactions-header">
        <span>Transaction History</span>
        <v-icon>mdi-history</v-icon>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn color="primary" @click="addTransaction">Add Transaction</v-btn>
    </v-toolbar>

    <!-- Transactions Table -->
    <v-data-table :headers="tableHeaders" :items="transactions" item-key="id" hide-default-footer :items-per-page="-1">
      <template v-slot:item.category.type="{ item }">
        <v-icon v-if="item.category.type === 'EXPENSE'" color="red">mdi-cash-minus</v-icon>
        <v-icon v-else-if="item.category.type === 'INCOME'" color="green">mdi-cash-plus</v-icon>
      </template>
      <template v-slot:item.date="{ item }">
        {{ formatDateAndTime(item.date) }}
      </template>
      <template v-slot:item.actions="{ item }">
        <div class="actions-column">
          <v-btn icon color="primary" class="edit-button" @click="editTransaction(item)">
            <v-icon>mdi-pencil-outline</v-icon>
          </v-btn>
          <v-btn icon color="error" class="remove-button" @click="openRemoveTransactionDialog(item)">
            <v-icon>mdi-delete-outline</v-icon>
          </v-btn>
        </div>
      </template>
    </v-data-table>

    <!-- Edit Transaction Modal -->
    <v-dialog v-model="isEditMode" max-width="500px">
      <v-card>
        <v-card-text>
          <v-form @submit.prevent="saveEditedTransaction">
            <v-row justify="center">
              <v-col cols="12">
                <v-tabs v-model="editedTransaction.selectedCategoryTypeIndex" centered
                  @change="updateCategoryType(editedTransaction.selectedCategoryTypeIndex)">
                  <v-tab v-for="(categoryType, index) in categoryTypes" :key="index" :value="index">{{ categoryType
                  }}</v-tab>
                </v-tabs>
              </v-col>
            </v-row>
            <v-select v-model="editedTransaction.categoryId" :items="editedTransaction.filteredCategoriesByType"
              item-text="name" item-value="id" label="Category" required>
            </v-select>
            <v-text-field :value="editedTransaction.amount" label="Amount" required type="number"
              @input="sanitizeAmountInput($event)"></v-text-field>
            <v-select v-model="editedTransaction.currency" :items="currencies" label="Currency" required></v-select>
            <v-menu :value="editedTransaction.dateMenu" :close-on-content-click="false" offset-y min-width="auto">
              <template v-slot:activator="{ on }">
                <v-text-field v-model="editedTransaction.formattedDate" label="Date" required readonly v-on="on"
                  @click="editedTransaction.dateMenu = true"></v-text-field>
              </template>
              <v-date-picker :value="editedTransaction.date" :time="true" no-title
                @input="updateDate($event)"></v-date-picker>
            </v-menu>
            <v-menu v-model="editedTransaction.timeMenu" :close-on-content-click="false" offset-y>
              <template v-slot:activator="{ on }">
                <v-text-field v-model="editedTransaction.formattedTime" label="Time" required readonly v-on="on"
                  @click="editedTransaction.timeMenu = true"></v-text-field>
              </template>
              <v-time-picker :value="extractTime(editedTransaction.date)" @input="updateTime($event)"
                full-width></v-time-picker>
            </v-menu>
            <v-textarea v-model="editedTransaction.description" label="Description" required
              class="custom-text-area"></v-textarea>
            <v-btn color="primary" type="submit">Save</v-btn>
            <v-btn @click="cancelEdit">Cancel</v-btn>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>

    <ConfirmationDialog :showDialog="showRemoveConfirmation" @cancel="cancelRemoveTransactionDialog"
      @confirm="removeTransaction" title="Removing transaction"
      message="Are you sure you want to remove this transaction?" />
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

tbody tr:hover {
  background-color: rgba(0, 0, 0, 0.05);
  /* Adjust the opacity value to control the color change */
}

.edit-button {
  margin-right: 1rem;
}
</style>

<script>
import { TransactionsService } from '~/services/TransactionsService.js';
import { CategoriesService } from '~/services/CategoriesService.js';
import ConfirmationDialog from '~/components/ConfirmationDialog.vue';

export default {
  components: {
    ConfirmationDialog,
  },
  data() {
    return {
      transactions: [],
      currencies: [],
      categories: [],
      categoryTypes: [],
      isEditMode: false,
      showRemoveConfirmation: false,
      transactionToRemove: null,
      editedTransaction: {
        id: null,
        amount: '',
        description: '',
        date: null,
        time: null,
        dateMenu: false,
        currency: null,
        formattedDate: '',
        timeMenu: false,
        formattedTime: '',
        selectedCategoryTypeIndex: 0,
        categoryType: '',
        categoryId: '',
        filteredCategoriesByType: []
      },
      tableHeaders: [
        { text: 'Type', value: 'category.type' },
        { text: 'Category', value: 'category.name' },
        { text: 'Description', value: 'description' },
        { text: 'Amount', value: 'amount' },
        { text: 'Currency', value: 'currency' },
        { text: 'Date', value: 'date' },
        { text: '', value: 'actions', sortable: false },
      ],
      transactionsService: null,
      categoriesService: null
    };
  },
  methods: {
    async fetchData() {
      try {
        this.transactions = await this.transactionsService.getTransactions();
        this.currencies = await this.transactionsService.getCurrencies();
        this.categories = await this.categoriesService.getCategories();
        this.categoryTypes = await this.categoriesService.getCategoryTypes();
      } catch (error) {
        console.error('Failed to fetch transactions:', error);
        this.showSnackbarError('Failed to fetch transactions');

      }
    },
    formatDateAndTime(date) {
      const options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' };
      const formattedDate = new Date(date).toLocaleDateString(undefined, options);
      return formattedDate;
    },
    formatDate(date) {
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      const formattedDate = new Date(date).toLocaleDateString(undefined, options);
      return formattedDate;
    },
    formatTime(date) {
      return date ? new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '';
    },
    openRemoveTransactionDialog(transactionToRemove) {
      this.transactionToRemove = transactionToRemove;
      this.showRemoveConfirmation = true;
    },
    cancelRemoveTransactionDialog() {
      this.transactionToRemove = null;
      this.showRemoveConfirmation = false;
    },
    async addTransaction() {
      try {
        // Clear the editedTransaction object
        this.cancelEdit();

        // Set isEditMode to true to open the dialog
        this.isEditMode = true;

        // Optionally, you can also set default values for the fields in the editedTransaction object
        // For example, you can set the current date and time as defaults:
        const currentDate = new Date();
        this.editedTransaction.date = currentDate.toISOString();
        this.editedTransaction.formattedDate = this.formatDate(currentDate.toISOString());
        this.editedTransaction.formattedTime = this.formatTime(currentDate.toISOString());

        // Update the filtered categories based on the default category type
        this.updateCategoryType(this.editedTransaction.selectedCategoryTypeIndex);
      } catch (error) {
        console.error('Failed to add transaction:', error);
        this.showSnackbarError('Failed to add transaction');
      }
    },
    updateCategoryType(value) {
      this.editedTransaction.selectedCategoryTypeIndex = value;
      this.editedTransaction.categoryType = this.categoryTypes[value];
      this.updateFilteredCategoriesByType(this.editedTransaction.categoryType);
      this.$nextTick(() => { // 🌞😡🥵🌞
        this.$forceUpdate();
      });
    },
    updateFilteredCategoriesByType(categoryType) {
      this.editedTransaction.filteredCategoriesByType = this.categories.filter(category => category.type === categoryType);
    },
    editTransaction(transaction) {
      this.isEditMode = true;
      this.editedTransaction = { ...transaction };
      this.editedTransaction.date = new Date(transaction.date).toISOString();
      this.editedTransaction.formattedDate = this.formatDate(this.editedTransaction.date);
      this.editedTransaction.formattedTime = this.formatTime(this.editedTransaction.date);
      this.editedTransaction.currency = transaction.currency;
      this.editedTransaction.categoryId = transaction.category.id;
      this.updateCategoryType(this.categoryTypes.findIndex(categoryType => categoryType === transaction.category.type));
    },
    sanitizeAmountInput(event) {
      const inputValue = event || '';
      const sanitizedValue = inputValue.replace(/[eE]/g, '');
      this.editedTransaction.amount = parseFloat(sanitizedValue);
    },
    async saveEditedTransaction() {
      try {
        const editedTransaction = { ...this.editedTransaction };

        let transactionBody = {
          amount: editedTransaction.amount ? editedTransaction.amount : null,
          date: editedTransaction.date ? editedTransaction.date : null,
          description: editedTransaction.description ? editedTransaction.description : null,
          categoryId: editedTransaction.categoryId ? parseInt(editedTransaction.categoryId) : null,
          currency: editedTransaction.currency,
        };

        if (editedTransaction.id) {
          const updatedTransaction = await this.transactionsService.updateTransaction(
            parseInt(editedTransaction.id),
            transactionBody
          );
          console.log('Transaction updated:', updatedTransaction);

          let updatedTransactions = this.transactions.map(transaction => {
            if (transaction.id === updatedTransaction.id) {
              return updatedTransaction;
            }
            return transaction;
          });

          this.transactions = updatedTransactions;

        } else {
          if (!editedTransaction.amount || editedTransaction.amount <= 0) {
            this.showSnackbarError('Please enter a valid amount greater than zero.');
            return;
          }

          if (!editedTransaction.date) {
            this.showSnackbarError('Please select a date for the transaction.');
            return;
          }

          if (!editedTransaction.categoryId) {
            this.showSnackbarError('Please select a category for the transaction.');
            return;
          }

          if (!editedTransaction.description) {
            this.showSnackbarError('Please provide a description for the transaction.');
            return;
          }

          if (!editedTransaction.currency) {
            this.showSnackbarError('Please select a currency for the transaction.');
            return;
          }
          const createdTransaction = await this.transactionsService.createTransaction(
            transactionBody
          );

          console.log('Transaction created:', createdTransaction);
          this.transactions = [createdTransaction, ...this.transactions];
        }

        // Refresh transactions
        this.cancelEdit()
      } catch (error) {
        console.error('Failed to save transaction:', error);
        this.showSnackbarError('Failed to save transaction');
      }
    },
    cancelEdit() {
      this.isEditMode = false;
      this.editedTransaction = {
        id: null,
        amount: '',
        description: '',
        date: null,
        time: null,
        dateMenu: false,
        currency: null,
        formattedDate: '',
        timeMenu: false,
        formattedTime: '',
        selectedCategoryTypeIndex: 0,
        categoryType: '',
        categoryId: '',
        filteredCategoriesByType: []
      }
    },
    async removeTransaction() {
      if (this.transactionToRemove) {
        try {
          const deletedTransaction = await this.transactionsService.deleteTransaction(parseInt(this.transactionToRemove.id));

          if (deletedTransaction?.id) {
            console.log('Transaction deleted:', this.transactionToRemove);
            this.transactions = this.transactions.filter(transaction => transaction.id !== deletedTransaction.id)
            this.cancelRemoveTransactionDialog();
          }
        } catch (error) {
          console.error('Failed to remove transaction:', error);
          this.showSnackbarError('Failed to remove transaction');
          this.cancelRemoveTransactionDialog();
        }
      }
    },
    updateDate(date) {
      const newDate = new Date(date);
      const currentDate = this.editedTransaction.date ? new Date(this.editedTransaction.date) : new Date();
      const newDateTime = new Date(
        newDate.getFullYear(),
        newDate.getMonth(),
        newDate.getDate(),
        currentDate.getHours(),
        currentDate.getMinutes()
      );
      this.editedTransaction.date = newDateTime.toISOString();
      this.editedTransaction.formattedDate = this.formatDate(newDateTime.toISOString());
    },

    updateTime(time) {
      const currentDate = this.editedTransaction.date ? new Date(this.editedTransaction.date) : new Date();
      let [hours, minutes] = time.split(':');
      hours = hours != "NaN" ? parseInt(hours) : currentDate.getHours();
      minutes = minutes != "NaN" ? parseInt(minutes) : currentDate.getMinutes();

      const newDateTime = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        currentDate.getDate(),
        hours,
        minutes
      );
      this.editedTransaction.date = newDateTime.toISOString();
      this.editedTransaction.formattedTime = this.formatTime(newDateTime.toISOString());
    },
    extractTime(dateTime) {
      if (!dateTime) return null;
      const dateObject = new Date(dateTime);
      const timeString = dateObject.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      return new Date(`1970-01-01 ${timeString}`);
    },
    showSnackbarError(errorMessage) {
      this.$store.dispatch('snackbar/showSnackbarError', errorMessage);
    }
  },
  computed: {
    categoryType() {
      return this.editedTransaction.categoryType;
    },
  },
  mounted() {
    this.transactionsService = new TransactionsService(this.$apollo, this.$store);
    this.categoriesService = new CategoriesService(this.$apollo, this.$store);
    this.fetchData();
  },
};
</script>
