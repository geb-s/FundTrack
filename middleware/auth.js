export default function ({ store, route, redirect }) {
    const token = localStorage.getItem('token');

    // If the user is not logged in
    if (!token) {
        // Allow access to the landing page, login, and register pages
        if (route.path !== '/' && route.path !== '/login' && route.path !== '/register') {
            return redirect('/');
        }
    } else {
        // If the user has a validated token, redirect to the dashboard
        if (route.path === '/') {
            return redirect('/dashboard');
        }

        // Check if the token is already validated in the store
        if (!store.state.auth.isAuthenticated) {
            // Dispatch an action to validate the token and set the authentication state
            return store.dispatch('auth/validateToken')
                .then((isValidToken) => {
                    if (!isValidToken) {
                        // Token validation failed, clear the token and redirect to the landing page
                        localStorage.removeItem('token');
                        return redirect('/');
                    }
                })
                .catch(() => {
                    // Token validation failed due to an error, clear the token and redirect to the landing page
                    localStorage.removeItem('token');
                    return redirect('/');
                });
        }
    }
}
