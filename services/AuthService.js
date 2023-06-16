import { gql } from 'apollo-boost';

export class AuthService {

    static async login(email, password, apollo, router) {

        const response = await apollo.mutate({
            mutation: gql`
                    mutation Login($input: LoginInput!) {
                        login(input: $input)
                    }
                `,
            variables: {
                input: {
                    email: email,
                    password: password,
                },
            },
        });

        const token = response.data.login;
        localStorage.setItem('token', token);
        router.push('/dashboard');
    }

    static async register(name, email, password, apollo, router) {

        const response = await apollo.mutate({
            mutation: gql`
                    mutation Register($input: CreateUserDto!) {
                        createUser(input: $input) {
                            id
                            name
                            email
                        }
                    }
                `,
            variables: {
                input: {
                    name: name,
                    email: email,
                    password: password,
                },
            },
        });

        const user = response.data.createUser;
        console.log('User created:', user);

        // Automatically log in the user after registration
        await this.login(email, password, apollo, router);

    }
    static async validateToken(apollo) {

        const response = await apollo.mutate({
            mutation: gql`
            mutation ValidateToken {
              validateToken
            }
          `,
            context: {
                headers: {
                    Authorization: `Bearer ${this.getToken()}`,
                },
            },
        });

        return response.data;
    }

    static getToken() {
        // Retrieve the token from local storage
        return localStorage.getItem('token');
    }
}
