import { gql } from 'apollo-boost';
import { AuthService } from './AuthService';
import ErrorService from './ErrorService';

export class CategoriesService {
    constructor(apollo, store) {
        this.apollo = apollo;
        this.store = store;
    }

    async createCategory(categoryData) {
        const jwtToken = AuthService.getToken();
        try {
            const response = await this.apollo.mutate({
                mutation: gql`
                    mutation createCategory($input: CreateCategoryDto!) {
                        createCategory(input: $input) {
                            id
                            name
                            type
                        }
                    }
                `,
                variables: {
                    input: categoryData,
                },
                context: {
                    headers: {
                        Authorization: `Bearer ${jwtToken}`,
                    },
                },
            });
            return response.data.createCategory;
        } catch (error) {
            console.error('Error creating category:', error);
            throw Error(ErrorService.getErrorMessage(error));
        }
    }

    async updateCategory(categoryId, categoryData) {
        const jwtToken = AuthService.getToken();
        try {
            const response = await this.apollo.mutate({
                mutation: gql`
                    mutation updateCategory($categoryId: Int!, $input: UpdateCategoryDto!) {
                        updateCategory(categoryId: $categoryId, input: $input) {
                            id
                            name
                            type
                        }
                    }
                `,
                variables: {
                    categoryId,
                    input: categoryData,
                },
                context: {
                    headers: {
                        Authorization: `Bearer ${jwtToken}`,
                    },
                },
            });
            return response.data.updateCategory;
        } catch (error) {
            console.error(`Error updating category with ID ${categoryId}:`, error);
            throw Error(ErrorService.getErrorMessage(error));
        }
    }

    async removeCategory(categoryId) {
        const jwtToken = AuthService.getToken();
        try {
            const response = await this.apollo.mutate({
                mutation: gql`
                    mutation removeCategory($categoryId: Int!) {
                        removeCategory(categoryId: $categoryId) {
                            id
                        }
                    }
                `,
                variables: {
                    categoryId,
                },
                context: {
                    headers: {
                        Authorization: `Bearer ${jwtToken}`,
                    },
                },
            });
            return response.data.removeCategory;
        } catch (error) {
            console.error(`Error deleting category with ID ${categoryId}:`, error);
            throw Error(ErrorService.getErrorMessage(error));
        }
    }


    async getCategories() {
        const jwtToken = AuthService.getToken();
        try {
            const response = await this.apollo.query({
                query: gql`
                    query getCategoriesForUser {
                        getCategoriesForUser {
                            id
                            name
                            type
                            updatedAt
                            createdAt
                        }
                    }
                `,
                context: {
                    headers: {
                        Authorization: `Bearer ${jwtToken}`,
                    },
                },
            });
            return response.data.getCategoriesForUser;
        } catch (error) {
            console.error('Error retrieving categories:', error);
            throw Error(ErrorService.getErrorMessage(error));
        }
    }

    async getCategoryTypes() {
        const jwtToken = AuthService.getToken();
        try {
            const response = await this.apollo.query({
                query: gql`
                    query getCategoryTypes {
                        getCategoryTypes
                    }
                `,
                context: {
                    headers: {
                        Authorization: `Bearer ${jwtToken}`,
                    },
                },
            });
            return response.data.getCategoryTypes;
        } catch (error) {
            console.error('Error retrieving currencies:', error);
            throw Error(ErrorService.getErrorMessage(error));
        }
    }
}