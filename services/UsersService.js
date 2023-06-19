import { gql } from 'apollo-boost';
import { AuthService } from './AuthService';
import ErrorService from './ErrorService';

export class UsersService {
    constructor(apollo, store) {
        this.apollo = apollo;
        this.store = store;
    }

    async getUser() {
        const jwtToken = AuthService.getToken();
        try {
            const response = await this.apollo.query({
                query: gql`
                    query getUser {
                        getUser {
                            id,
                            name, 
                            email
                        }
                    }
                `,
                context: {
                    headers: {
                        Authorization: `Bearer ${jwtToken}`,
                    },
                },
            });
            return response.data.getUser;
        } catch (error) {
            console.error('Error retrieving User data:', error);
            throw Error(ErrorService.getErrorMessage(error));
        }
    }


    async updateUser(userData) {
        const jwtToken = AuthService.getToken();
        try {
            const response = await this.apollo.mutate({
                mutation: gql`
                    mutation updateUser($input: UpdateUserDto!) {
                        updateUser(input: $input) {
                            name
                            email
                        }
                    }
                `,
                variables: {
                    input: userData,
                },
                context: {
                    headers: {
                        Authorization: `Bearer ${jwtToken}`,
                    },
                },
            });
            return response.data.updateUser;
        } catch (error) {
            console.error(`Error updating user`, error);
            throw Error(ErrorService.getErrorMessage(error));
        }
    }

}
