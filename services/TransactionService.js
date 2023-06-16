import { gql } from 'apollo-boost';
import { AuthService } from './AuthService';

export class TransactionService {

    static async getTransactions(apollo) {
        const jwtToken = AuthService.getToken();
        console.log("AAA");
        try {
            const response = await apollo.query({
                query: gql`
          query GetTransactionsForUser {
            getTransactionsForUser {
              id
              amount
              description
              date
              createdAt
              updatedAt
              category {
                id
              }
            }
          }
        `,
                context: {
                    headers: {
                        Authorization: `Bearer ${jwtToken}`,
                    },
                },
            });
            return response.data.getTransactionsForUser;
        } catch (error) {
            console.error('Error retrieving transactions:', error);
            throw error;
        }
    }

    static async createTransaction(transactionData, apollo) {
        const jwtToken = AuthService.getToken();
        try {
            const response = await apollo.mutate({
                mutation: gql`
          mutation CreateTransaction($input: CreateTransactionDto!) {
            createTransaction(input: $input) {
              id
              amount
              description
              date
              createdAt
              updatedAt
            }
          }
        `,
                variables: {
                    input: transactionData,
                },
                context: {
                    headers: {
                        Authorization: `Bearer ${jwtToken}`,
                    },
                },
            });
            return response.data.createTransaction;
        } catch (error) {
            console.error('Error creating transaction:', error);
            throw error;
        }
    }

    static async updateTransaction(transactionId, transactionData, apollo) {
        const jwtToken = AuthService.getToken();
        try {
            const response = await apollo.mutate({
                mutation: gql`
          mutation UpdateTransaction($transactionId: Int!, $input: UpdateTransactionDto!) {
            updateTransaction(transactionId: $transactionId, input: $input) {
              id
              amount
              description
              date
              createdAt
              updatedAt
            }
          }
        `,
                variables: {
                    transactionId,
                    input: transactionData,
                },
                context: {
                    headers: {
                        Authorization: `Bearer ${jwtToken}`,
                    },
                },
            });
            return response.data.updateTransaction;
        } catch (error) {
            console.error(`Error updating transaction with ID ${transactionId}:`, error);
            throw error;
        }
    }

    static async deleteTransaction(transactionId, apollo) {
        const jwtToken = AuthService.getToken();
        try {
            const response = await apollo.mutate({
                mutation: gql`
          mutation RemoveTransaction($transactionId: Int!) {
            removeTransaction(transactionId: $transactionId) {
              id
              amount
              description
              date
              createdAt
              updatedAt
            }
          }
        `,
                variables: {
                    transactionId,
                },
                context: {
                    headers: {
                        Authorization: `Bearer ${jwtToken}`,
                    },
                },
            });
            return response.data.removeTransaction;
        } catch (error) {
            console.error(`Error deleting transaction with ID ${transactionId}:`, error);
            throw error;
        }
    }
}
