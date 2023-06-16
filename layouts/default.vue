<template>
  <v-app dark>
    <v-app-bar :clipped-left="clipped" fixed app>
      <nuxt-link :to="'/'" class="nav-link">
        <v-toolbar-title class="ml-2">
          {{ projTitle }}
        </v-toolbar-title>
      </nuxt-link>
      <v-spacer />
      <div v-if="!isMobileScreen" class="nav-links">
        <nuxt-link v-for="item in desktopMenuItems" :key="item.title" :to="item.route" class="nav-link"
          v-if="isAuthenticated">
          <v-icon>{{ item.icon }}</v-icon>
          <span class="nav-link-text">{{ item.title }}</span>
        </nuxt-link>
        <a @click="showLogoutConfirmation = true" v-if="isAuthenticated" class="nav-link logout-link">
          <v-icon>mdi-logout</v-icon>
          <span class="nav-link-text">Logout</span>
        </a>
      </div>
      <v-btn icon @click="toggleDrawer" v-if="isMobileScreen">
        <v-icon>mdi-menu</v-icon>
      </v-btn>
    </v-app-bar>
    <v-navigation-drawer v-model="drawer" :mini-variant="miniVariant" :clipped="clipped" app right>
      <v-list>
        <v-list-item v-for="item in drawerItems" :key="item.title" @click="handleMenuItemClick(item)"
          v-if="isAuthenticated || item.route === '/'">
          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <nuxt-link :to="item.route" class="nav-link">{{ item.title }}</nuxt-link>
          </v-list-item-content>
        </v-list-item>
        <v-divider v-if="isAuthenticated"></v-divider>
        <v-list-item v-if="isAuthenticated" @click="showLogoutConfirmation = true">
          <v-list-item-action>
            <v-icon>mdi-logout</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <span class="nav-link">Logout</span>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-main>
      <v-container>
        <Nuxt />
      </v-container>
    </v-main>
    <v-footer :absolute="!fixed" app>
      <span>&copy; {{ new Date().getFullYear() }} {{ projTitle }}</span>
    </v-footer>

    <v-dialog v-model="showLogoutConfirmation" persistent max-width="500px">
      <v-card>
        <v-card-title class="headline">Logout Confirmation</v-card-title>
        <v-card-text>
          <span>Are you sure you want to logout?</span>
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" text @click="showLogoutConfirmation = false">Cancel</v-btn>
          <v-btn color="error" text @click="logout">Logout</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-app>
</template>

<script>
import { AuthService } from '~/services/AuthService';

export default {
  name: 'DefaultLayout',
  data() {
    return {
      clipped: false,
      fixed: false,
      projTitle: 'FundTrack',
      drawer: false,
      miniVariant: false,
      showLogoutConfirmation: false,
      desktopMenuItems: [
        { title: 'Dashboard', icon: 'mdi-view-dashboard', route: '/dashboard' },
        { title: 'Transactions', icon: 'mdi-currency-usd', route: '/transactions' },
        { title: 'Profile', icon: 'mdi-account', route: '/profile' }
      ],
      drawerItems: [
        { title: 'Dashboard', icon: 'mdi-view-dashboard', route: '/dashboard' },
        { title: 'Transactions', icon: 'mdi-currency-usd', route: '/transactions' },
        { title: 'Profile', icon: 'mdi-account', route: '/profile' }
      ]
    }
  },
  computed: {
    isMobileScreen() {
      return this.$vuetify.breakpoint.smAndDown
    },
    isAuthenticated() {
      // Replace this with your authentication logic
      return this.$store.state.auth.isAuthenticated;
    }
  },
  methods: {
    toggleDrawer() {
      if (this.isMobileScreen) {
        this.drawer = !this.drawer
      }
    },
    handleMenuItemClick(item) {
      // Handle menu item click
    },
    logout() {
      this.showLogoutConfirmation= false,
      this.$store.dispatch('auth/removeToken');
      this.$router.push('/');
    }
  },
  watch: {
    isMobileScreen(value) {
      if (!value) {
        this.$nextTick(() => {
          this.drawer = false
        })
      }
    }
  }
}
</script>

<style scoped>
.nav-link {
  color: #ffffff;
  font-size: 16px;
  text-decoration: none;
}

.nav-links {
  display: flex;
  gap: 20px;
}

.nav-link-text {
  margin-left: 0.2rem;
}

.logout-link {
  color: #ffffff;
  font-size: 16px;
  text-decoration: none;
  cursor: pointer;
  margin-left: 20px;
}

.logout-link:focus,
.logout-link:active {
  outline: none;
}
</style>
