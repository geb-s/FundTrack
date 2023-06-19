export default class ErrorService {
    static getErrorMessage(error) {
        if (error && error.message) {
            const errorMessage = error.message.replace("GraphQL error:", "").trim();
            return errorMessage;
        }
        return "An unknown error occurred.";
    }
}