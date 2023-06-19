import { gql } from 'apollo-boost';
import { AuthService } from './AuthService';

export class TransactionsService {
    constructor(apollo, store) {
        this.apollo = apollo;
        this.store = store;
    }

    async getTransactions() {
        const jwtToken = AuthService.getToken();
        try {
            const response = await this.apollo.query({
                query: gql`
                    query GetTransactionsForUser {
                        getTransactionsForUser {
                        id
                        amount
                        description
                        date
                        createdAt
                        updatedAt
                        currency
                        category {
                            id
                            name
                            type
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
            throw Error(ErrorService.getErrorMessage(error));
        }
    }

    async getCurrencies() {
        const jwtToken = AuthService.getToken();
        try {
            const response = await this.apollo.query({
                query: gql`
                    query getCurrencies {
                        getCurrencies
                    }
                `,
                context: {
                    headers: {
                        Authorization: `Bearer ${jwtToken}`,
                    },
                },
            });
            return response.data.getCurrencies;
        } catch (error) {
            console.error('Error retrieving currencies:', error);
            throw Error(ErrorService.getErrorMessage(error));
        }
    }

    async createTransaction(transactionData) {
        const jwtToken = AuthService.getToken();
        try {
            const response = await this.apollo.mutate({
                mutation: gql`
                    mutation CreateTransaction($input: CreateTransactionDto!) {
                        createTransaction(input: $input) {
                            id
                            amount
                            description
                            date
                            createdAt
                            updatedAt
                            category{
                                id
                                name
                                type
                            }
                            currency
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
            throw Error(ErrorService.getErrorMessage(error));
        }
    }

    async updateTransaction(transactionId, transactionData) {
        const jwtToken = AuthService.getToken();
        try {
            const response = await this.apollo.mutate({
                mutation: gql`
                    mutation UpdateTransaction($transactionId: Int!, $input: UpdateTransactionDto!) {
                        updateTransaction(transactionId: $transactionId, input: $input) {
                            id
                            amount
                            description
                            date
                            createdAt
                            updatedAt
                            category{
                                id
                                name
                                type
                            }
                            currency
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
            throw Error(ErrorService.getErrorMessage(error));
        }
    }

    async deleteTransaction(transactionId) {
        const jwtToken = AuthService.getToken();
        try {
            const response = await this.apollo.mutate({
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
            throw Error(ErrorService.getErrorMessage(error));
        }
    }

    async getMostCommonCategories() {
        const jwtToken = AuthService.getToken();
        try {
            const response = await this.apollo.query({
                query: gql`
                    query getMostCommonCategories {
                        getMostCommonCategories {
                        id,
                            name
                        type
                        }
                    }
                `,
                context: {
                    headers: {
                        Authorization: `Bearer ${jwtToken}`,
                    },
                },
            });
            return response.data.getMostCommonCategories;
        } catch (error) {
            console.error('Error retrieving most common categories:', error);
            throw Error(ErrorService.getErrorMessage(error));
        }
    }

    async getTotalAmountPerCurrencyByType() {
        const jwtToken = AuthService.getToken();
        try {
            const response = await this.apollo.query({
                query: gql`
                    query getTotalAmountPerCurrencyByType {
                        getTotalAmountPerCurrencyByType {
                            transactionTypeAmount {
                                type
                                currency
                                totalAmount
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
            return response.data.getTotalAmountPerCurrencyByType.transactionTypeAmount;
        } catch (error) {
            console.error('Error retreiving total amount per currency by type:', error);
            throw Error(ErrorService.getErrorMessage(error));
        }
    }
    async getTransactionsLastThreeMonths() {
        const jwtToken = AuthService.getToken();
        try {
            const response = await this.apollo.query({
                query: gql`
                    query getTransactionsLastThreeMonths {
                        getTransactionsLastThreeMonths {
                                id
                        amount
                        description
                        date
                        createdAt
                        updatedAt
                        category{
                            id
                            name
                            type
                        }
                        currency
                        }
                    }
                `,
                context: {
                    headers: {
                        Authorization: `Bearer ${jwtToken}`,
                    },
                },
            });
            return response.data.getTransactionsLastThreeMonths;
        } catch (error) {
            console.error('Error retreiving transactions from the last 3 months:', error);
            throw Error(ErrorService.getErrorMessage(error));
        }
    }

    async getMostRecentTransactions() {
        const jwtToken = AuthService.getToken();
        try {
            const response = await this.apollo.query({
                query: gql`
                    query getMostRecentTransactions {
                        getMostRecentTransactions {
                            id
                        amount
                        description
                        date
                        createdAt
                        updatedAt
                        category{
                            id
                            name
                            type
                        }
                        currency
                        }
                    }
                `,
                context: {
                    headers: {
                        Authorization: `Bearer ${jwtToken}`,
                    },
                },
            });
            return response.data.getMostRecentTransactions;
        } catch (error) {
            console.error('Error retreiving most recent transactions:', error);
            throw Error(ErrorService.getErrorMessage(error));
        }
    }
}
